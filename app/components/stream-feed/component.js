import Component from 'ember-component';
import { task } from 'ember-concurrency';
import get, { getProperties } from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { isEmpty } from 'ember-utils';
import { capitalize } from 'ember-string';
import computed from 'ember-computed';
import getter from 'client/utils/getter';
import { mediaType } from 'client/helpers/media-type';

export default Component.extend({
  filter: 'all',
  readOnly: false,
  session: service(),
  store: service(),
  metrics: service(),

  feedId: getter(function() {
    return `${get(this, 'streamType')}:${get(this, 'streamId')}`;
  }),

  filterOptions: computed('filter', {
    get() {
      return ['all', 'media', 'user'].removeObject(get(this, 'filter'));
    }
  }).readOnly(),

  filteredFeed: computed('feed', 'filter', {
    get() {
      const feed = get(this, 'feed');
      if (feed === undefined) {
        return [];
      }
      let result = feed;
      const filter = get(this, 'filter');
      if (filter === 'media') {
        result = result.filter(group => (
          get(group, 'activities.firstObject.foreignId').split(':')[0] === 'LibraryEntry'
        ));
      } else if (filter === 'user') {
        result = result.reject(group => (
          get(group, 'activities.firstObject.foreignId').split(':')[0] === 'LibraryEntry'
        ));
      }
      return result;
    }
  }).readOnly(),

  getFeedData: task(function* (type, id) {
    return yield get(this, 'store').query('feed', {
      type,
      id,
      include: [
        // activity
        'media,actor,unit,subject',
        // posts
        'subject.user,subject.target_user',
        // library-entry/post
        'subject.media',
        // follow
        'subject.follower,subject.followed'
      ].join(',')
    });
  }).restartable(),

  createPost: task(function* (content, options) {
    const data = { content, user: get(this, 'session.account'), ...options };
    // posting on another user's profile
    if (get(this, 'user') !== undefined && get(this, 'user.id') !== get(this, 'session.account.id')) {
      set(data, 'targetUser', get(this, 'user'));
    }
    // spoiler + media set
    if (get(data, 'spoiler') === true && get(data, 'media') !== undefined) {
      const entry = yield get(this, 'store').query('library-entry', {
        filter: {
          user_id: get(this, 'session.account.id'),
          media_type: capitalize(mediaType([get(data, 'media')])),
          media_id: get(data, 'media.id')
        },
        include: 'unit'
      });
      set(data, 'spoiledUnit', get(entry, 'unit'));
    }
    const post = get(this, 'store').createRecord('post', data);
    const [group, activity] = this._createTempActivity(post);
    yield post.save()
      .then(record => set(activity, 'foreignId', `Post:${get(record, 'id')}`))
      .catch(() => get(this, 'feed').removeObject(group));
  }).drop(),

  /**
   * Create a temporary activity group record so that we can push a new
   * post into the feed without a refresh.
   *
   * TODO:
   * When we enable real-time updates, we'll need to grab all groups that
   * don't have a set id, match the content from the real-time update and
   * fill in the missing details.
   */
  _createTempActivity(record) {
    const activity = get(this, 'store').createRecord('activity', {
      subject: record,
      foreignId: 'Post:<unknown>'
    });
    const group = get(this, 'store').createRecord('activity-group', {
      activities: [activity]
    });
    const feed = get(this, 'feed').toArray();
    feed.insertAt(0, group);
    set(this, 'feed', feed);
    return [group, activity];
  },

  didReceiveAttrs() {
    this._super(...arguments);
    const { streamType, streamId } = getProperties(this, 'streamType', 'streamId');
    if (isEmpty(streamType) || isEmpty(streamId)) {
      return;
    }
    get(this, 'getFeedData').perform(streamType, streamId).then((data) => {
      set(this, 'feed', data);
      const list = data.map(group => get(group, 'activities').map(activity => get(activity, 'foreignId')));
      if (isEmpty(list) === true) {
        return;
      }
      get(this, 'metrics').invoke('trackImpression', 'Stream', {
        content_list: list.reduce((a, b) => a.concat(b)).uniq(),
        feed_id: get(this, 'feedId')
      });
    }).catch(() => {});
  }
});
