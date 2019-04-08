import Component from '@ember/component';
import { all, task } from 'ember-concurrency';
import EmberObject, { get, getProperties, set, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { storageFor } from 'ember-local-storage';
import { capitalize, classify } from '@ember/string';
import getter from 'client/utils/getter';
import errorMessages from 'client/utils/error-messages';
import { unshiftObjects } from 'client/utils/array-utils';
import { concat } from 'client/utils/computed-macros';
import Pagination from 'kitsu-shared/mixins/pagination';
import { scheduleOnce } from '@ember/runloop';

export default Component.extend(Pagination, {
  readOnly: false,
  showFollowingFilter: false,
  allFeedItems: concat('feed', 'paginatedRecords'),
  ajax: service(),
  features: service(),
  headData: service(),
  headTags: service(),
  notify: service(),
  store: service(),
  queryCache: service(),
  metrics: service(),
  raven: service(),
  streamRealtime: service(),
  lastUsed: storageFor('last-used'),

  feedId: getter(function() {
    return `${get(this, 'streamType')}:${get(this, 'streamId')}`;
  }),

  getFeedData: task(function* (limit = 10) {
    const { streamType: type, streamId: id } = getProperties(this, 'streamType', 'streamId');
    const kind = get(this, 'filter');
    const options = {
      type,
      id,
      include: [
        // activity
        'media,actor,unit,subject,target',
        // posts (and comment system)
        'target.user,target.target_user,target.spoiled_unit,target.media,target.target_group,target.uploads',
        'subject.user,subject.target_user,subject.spoiled_unit,subject.media,subject.target_group,subject.uploads',
        // follow
        'subject.followed',
        // review/reaction
        'subject.library_entry,subject.anime,subject.manga'
      ].join(','),
      page: { limit }
    };
    if (!isEmpty(kind) && kind !== 'all') {
      options.filter = { kind: kind === 'user' ? 'posts' : kind };
    }
    return yield this.queryPaginated('feed', options, { cache: false });
  }).keepLatest(),

  createPost: task(function* (content, options) {
    const data = { content, user: get(this, 'session.account'), ...options };
    // posting on another user's profile
    if (get(this, 'user') !== undefined && get(this, 'user.id') !== get(this, 'session.account.id')) {
      set(data, 'targetUser', get(this, 'user'));
    }
    // posting on an interest feed
    if (get(this, 'streamInterest') !== undefined) {
      set(data, 'targetInterest', classify(get(this, 'streamInterest')));
    }
    // posting on a group
    if (get(this, 'kitsuGroup') !== undefined) {
      set(data, 'targetGroup', get(this, 'kitsuGroup'));
    }
    // spoiler + media set
    if (get(data, 'media') !== undefined && isEmpty(get(options, 'unitNumber')) === false) {
      const media = get(data, 'media');
      const mediaType = capitalize(get(media, 'modelType'));
      const unitType = mediaType === 'Anime' ? 'episode' : 'chapter';
      const number = get(options, 'unitNumber');
      let filter;
      if (mediaType === 'Anime') {
        filter = {
          mediaType,
          number,
          media_id: get(media, 'id')
        };
      } else {
        filter = { manga_id: get(media, 'id'), number };
      }
      const units = yield get(this, 'queryCache').query(unitType, { filter });
      const unit = get(units, 'firstObject');
      if (unit) {
        set(data, 'spoiledUnit', unit);
      }
    }
    const post = get(this, 'store').createRecord('post', data);
    const [group, activity] = this._createTempActivity(post);
    // update post counter
    get(this, 'session.account').incrementProperty('postsCount');
    try {
      const record = yield post.save();
      yield all(data.uploads.filterBy('hasDirtyAttributes').map(upload => upload.save()));
      get(this, 'feed').insertAt(0, group);
      set(group, 'group', get(record, 'id'));
      set(activity, 'foreignId', `Post:${get(record, 'id')}`);
      get(this, 'metrics').trackEvent({ category: 'post', action: 'create' });
    } catch (err) {
      get(this, 'feed').removeObject(group);
      get(this, 'session.account').decrementProperty('postsCount');
      get(this, 'notify').error(errorMessages(err));
    }
  }).drop(),

  deleteActivity: task(function* (type, activity) {
    const activityId = get(activity, 'id');
    const actorId = get(activity, 'actor.id');
    const feedUrl = `/feeds/${type}/${actorId}/activities/${activityId}`;
    return yield get(this, 'ajax').delete(feedUrl);
  }).enqueue(),

  handleFilter: observer('filter', function() {
    this._cancelSubscription();
    const promise = this._getFeedData(10);
    if (promise) {
      promise.then((data) => {
        this._setupSubscription(data);
      });
    }
  }),

  didReceiveAttrs() {
    this._super(...arguments);
    scheduleOnce('afterRender', () => {
      get(this, 'headTags').collectHeadTags();
    });
    set(this, 'filterOptions', ['all', 'media', 'user']);
    if (get(this, 'features').hasFeature('feed_following_filter') && get(this, 'showFollowingFilter')) {
      this.filterOptions.push('following');
    }

    if (get(this, 'kitsuGroup')) {
      set(this, 'filter', 'all');
    } else {
      set(this, 'filter', get(this, 'lastUsed.feedFilter') || get(this, 'streamFilter') || 'all');
      if (get(this, 'filter') === 'following' && !get(this, 'showFollowingFilter')) {
        set(this, 'filter', 'all');
      }
    }

    // cancel any previous subscriptions
    this._cancelSubscription();
    const promise = this._getFeedData(10);
    if (promise !== undefined) {
      promise.then((data) => {
        this._setupSubscription(data);
      });
    }

    // notice
    if (get(this, 'streamType') === 'interest_timeline') {
      const seenNotice = get(this, `lastUsed.feed-${get(this, 'streamInterest')}-notice`);
      set(this, 'showInterestNotice', !seenNotice);
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    this._cancelSubscription();
  },

  _getFeedData(limit = 10) {
    const { streamType, streamId } = getProperties(this, 'streamType', 'streamId');
    if (isEmpty(streamType) || isEmpty(streamId)) {
      return;
    }
    set(this, 'feed', []);
    set(this, 'paginatedRecords', []);
    set(this, 'newItems', EmberObject.create({ length: 0, cache: [] }));
    return get(this, 'getFeedData').perform(limit).then((data) => {
      get(this, 'feed').addObjects(data);
      set(this, 'feed.links', get(data, 'links'));

      // stream analytics
      this._trackImpressions(data);

      return data;
    }).catch((error) => {
      this.resetPageState();
      get(this, 'raven').captureException(error);
    });
  },

  /**
   * Create a temporary activity group record so that we can push a new
   * post into the feed without a refresh.
   */
  _createTempActivity(record) {
    const activity = get(this, 'store').createRecord('activity', {
      subject: record,
      foreignId: 'Post:<unknown>'
    });
    const group = get(this, 'store').createRecord('activity-group', {
      group: '<unknown>',
      activities: [activity]
    });
    return [group, activity];
  },

  _trackImpressions() {
  },

  _setupSubscription(data) {
    if (isEmpty(data)) { return; }
    // realtime
    const meta = get(data, 'meta');
    const group = get(meta, 'feed.group');
    const id = get(meta, 'feed.id');
    const token = get(meta, 'readonlyToken');
    this.subscription = get(this, 'streamRealtime').subscribe(group, id, token, object => (
      this._handleRealtime(object)
    ));
  },

  _cancelSubscription() {
    const subscription = get(this, 'subscription');
    if (subscription !== undefined) {
      subscription.cancel();
    }
  },

  _handleRealtime(object) {
    // handle deletion
    (get(object, 'deleted') || []).forEach((activityId) => {
      let activity = get(this, 'feed').findBy('id', activityId);
      if (activity) {
        get(this, 'feed').removeObject(activity);
      } else {
        activity = get(this, 'paginatedRecords').findBy('id', activityId);
        get(this, 'paginatedRecords').removeObject(activity);
      }
    });

    const groupCache = get(this, 'newItems.cache');
    const filter = get(this, 'filter');
    get(this, 'newItems').beginPropertyChanges();
    get(object, 'new').forEach((activity) => {
      const type = get(activity, 'foreign_id').split(':')[0];

      // filter out content not apart of the current filter
      if (filter === 'media') {
        if (type === 'Post' || type === 'Comment') {
          return;
        }
      } else if (filter === 'user') {
        if (type !== 'Post' && type !== 'Comment') {
          return;
        }
      }

      // don't show a new activity action if the actor is the sessioned user
      if (type === 'Post' || type === 'Comment') {
        if (get(activity, 'actor').split(':')[1] === get(this, 'session.account.id')) {
          return;
        }
      }

      // add to new activities cache
      if (groupCache.indexOf(get(activity, 'group')) === -1) {
        set(this, 'newItems.length', get(this, 'newItems.length') + 1);
        groupCache.addObject(get(activity, 'group'));
      }
    });
    get(this, 'newItems').endPropertyChanges();

    if (get(this, 'newItems.length') > 0) {
      const title = `(${get(this, 'newItems.length')}) ${get(this, 'headData.title')}`;
      window.document.title = title;
    }
  },

  onPagination(_records) {
    const records = _records.toArray();
    const duplicates = records.filter(record => (
      get(this, 'allFeedItems').findBy('group', get(record, 'group')) !== undefined
    ));
    records.removeObjects(duplicates);
    this._super(records);
  },

  actions: {
    onPagination() {
      return this._super('feed', {
        type: get(this, 'streamType'),
        id: get(this, 'streamId'),
        page: {
          limit: 10,
          cursor: get(this, 'allFeedItems.lastObject.id')
        }
      });
    },

    deleteActivity(type, activity, callback) {
      get(this, 'deleteActivity').perform(type, activity).then(() => {
        if (callback !== undefined) {
          callback(...arguments);
        }
        get(this, 'notify').success('Your feed activity was deleted.');
      }).catch((err) => {
        get(this, 'notify').error(errorMessages(err));
      });
    },

    removeGroup(group) {
      get(this, 'feed').removeObject(group);
    },

    updateFilter(option) {
      set(this, 'filter', option);
      set(this, 'lastUsed.feedFilter', option);
    },

    /**
     * Request the activities from the API Server instead of enriching them locally
     * so we reduce the logic and handling of all the relationships needed for display.
     */
    newActivities() {
      const limit = get(this, 'newItems.length');
      set(this, 'realtimeLoading', true);
      get(this, 'getFeedData').perform(limit).then((data) => {
        set(this, 'newItems.length', 0);
        set(this, 'newItems.cache', []);
        get(this, 'headTags').collectHeadTags();

        // remove dups from the feed and replace with updated activity
        const dups = get(this, 'allFeedItems').filter(group => (
          data.findBy('group', get(group, 'group')) !== undefined
        ));
        get(this, 'allFeedItems').beginPropertyChanges();
        get(this, 'feed').removeObjects(dups);
        get(this, 'paginatedRecords').removeObjects(dups);
        get(this, 'allFeedItems').endPropertyChanges();

        // prepend the new activities
        unshiftObjects(get(this, 'feed'), data.toArray());
        set(this, 'realtimeLoading', false);
        this._trackImpressions(data);
      }).catch(() => set(this, 'realtimeLoading', false));
    },

    dismissNotice() {
      const interest = get(this, 'streamInterest');
      get(this, 'lastUsed').set(`feed-${interest}-notice`, true);
      set(this, 'showInterestNotice', false);
    }
  }
});
