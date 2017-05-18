import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import observer from 'ember-metal/observer';
import { guidFor } from 'ember-metal/utils';
import computed from 'ember-computed';
import { typeOf, isEmpty } from 'ember-utils';
import { scheduleOnce } from 'ember-runloop';
import getter from 'client/utils/getter';
import ClipboardMixin from 'client/mixins/clipboard';
import errorMessages from 'client/utils/error-messages';
import { invoke, invokeAction } from 'ember-invoke-action';
import { CanMixin } from 'ember-can';

export default Component.extend(ClipboardMixin, CanMixin, {
  classNameBindings: ['post.isNew:new-post', 'isPinnedPost:pinned-post', 'post.id:stream-item'],
  classNames: ['row'],
  isHidden: false,
  isFollowingPost: false,
  isOverflowed: false,
  isExpanded: false,

  embedly: service(),
  notify: service(),
  router: service('-routing'),
  store: service(),
  queryCache: service(),
  metrics: service(),
  host: getter(() => `${location.protocol}//${location.host}`),

  activity: getter(function() {
    return get(this, 'group.activities.firstObject');
  }),

  postEpisodeText: getter(function() {
    const unit = get(this, 'post.spoiledUnit');
    return isEmpty(get(unit, 'canonicalTitle')) ? '' : `- ${get(unit, 'canonicalTitle')}`;
  }),

  isEditable: getter(function() {
    if (get(this, 'session.account').hasRole('admin', get(this, 'post'))) {
      return true;
    }
    const time = get(this, 'post.createdAt').add(30, 'minutes');
    return !time.isBefore();
  }),

  postEdited: computed('post.createdAt', 'post.editedAt', function() {
    if (!get(this, 'post.editedAt')) { return false; }
    return !get(this, 'post.createdAt').isSame(get(this, 'post.editedAt'));
  }).readOnly(),

  canEditPost: computed(function() {
    const group = get(this, 'post').belongsTo('targetGroup').value();
    if (group) {
      return this.can('edit post in group', group, {
        membership: get(this, 'groupMembership'),
        post: get(this, 'post')
      });
    }
    return this.can('edit post', get(this, 'post'));
  }).readOnly(),

  _streamAnalytics(label, foreignId) {
    const data = {
      label,
      content: { foreign_id: foreignId },
      position: get(this, 'positionInFeed') || 0
    };
    if (get(this, 'feedId') !== undefined) {
      data.feed_id = get(this, 'feedId');
    }
    get(this, 'metrics').invoke('trackEngagement', 'Stream', data);
  },

  init() {
    this._super(...arguments);
    if (!get(this, 'isExpanded')) {
      get(this, 'embedly').setupListener();
      get(this, 'embedly').addSubscription(guidFor(this), () => {
        this._overflow();
      });
    }
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'group') !== undefined) {
      if (get(this, 'activity.foreignId').split(':')[0] === 'Comment') {
        set(this, 'post', get(this, 'activity.target.content') || get(this, 'activity.target'));
      } else {
        set(this, 'post', get(this, 'activity.subject.content') || get(this, 'activity.subject'));
      }
    }
    if (get(this, 'feedId') !== undefined) {
      set(this, 'userId', get(this, 'feedId').split(':')[1]);
    }

    const post = get(this, 'post');
    if (get(post, 'user') && get(this, 'session').isCurrentUser(get(post, 'user'))) {
      set(this, 'isHidden', get(post, 'nsfw'));
    } else {
      set(this, 'isHidden', get(post, 'nsfw') || get(post, 'spoiler'));
    }

    // groups
    if (get(post, 'id')) {
      const group = post.belongsTo('targetGroup').value();
      if (group) {
        if (get(this, 'kitsuGroupMembership')) {
          set(this, 'groupMembership', get(this, 'kitsuGroupMembership'));
        } else {
          get(this, 'queryCache').query('group-member', {
            filter: { group, user: get(this, 'session.account') },
            include: 'permissions'
          }).then((records) => {
            const record = get(records, 'firstObject');
            set(this, 'groupMembership', record);
          }).catch(() => {});
        }
      }
    }

    // follows
    if (get(post, 'id')) {
      if (get(this, 'session.hasUser') && !get(this, 'session').isCurrentUser(get(this, 'post.user'))) {
        this._updateFollow();
      }
    }

    if (!get(this, 'isHidden')) {
      this._overflow();
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    get(this, 'embedly').removeSubscription(guidFor(this));
  },

  _hideLongBody() {
    if (get(this, 'isDestroyed')) { return; }
    const body = this.$('.stream-content-post');
    if (body && body[0] && body.height() < body[0].scrollHeight) {
      set(this, 'isOverflowed', true);
    } else {
      set(this, 'isOverflowed', false);
    }
  },

  _overflow() {
    if (!get(this, 'isExpanded')) {
      scheduleOnce('afterRender', () => {
        if (get(this, 'isDestroyed')) { return; }
        this._hideLongBody();
        const image = this.$('img');
        if (image && image.length > 0) {
          this.$('img').one('load', () => { this._hideLongBody(); });
        }
      });
    }
  },

  _updateHidden: observer('post.nsfw', 'post.spoiler', function() {
    const post = get(this, 'post');
    set(this, 'isHidden', get(post, 'nsfw') || get(post, 'spoiler'));
  }),

  _updateContent: observer('post.contentFormatted', function() {
    this._overflow();
  }),

  _updateFollow() {
    get(this, 'queryCache').query('post-follow', {
      filter: {
        user_id: get(this, 'session.account.id'),
        post_id: get(this, 'post.id')
      }
    }).then((records) => {
      if (get(this, 'isDestroyed')) { return; }
      const record = get(records, 'firstObject');
      set(this, 'isFollowingPost', !!record);
      set(this, 'followRelationship', record);
    });
  },

  actions: {
    trackEngagement(label, id) {
      const foreignId = typeOf(id) === 'string' ? id : undefined;
      this._streamAnalytics(label, foreignId || `Post:${get(this, 'post.id')}`);
    },

    followPost() {
      if (get(this, 'isFollowingPost')) {
        get(this, 'followRelationship').destroyRecord().then(() => {
          set(this, 'isFollowingPost', false);
          set(this, 'followRelationship', null);
        });
      } else {
        const follow = get(this, 'store').createRecord('post-follow', {
          user: get(this, 'session.account'),
          post: get(this, 'post')
        });
        follow.save().then(() => {
          set(this, 'followRelationship', follow);
          set(this, 'isFollowingPost', true);
        });
      }
    },

    updateFollow() {
      this._updateFollow();
    },

    toggleHidden() {
      this.toggleProperty('isHidden');
      this._overflow();
    },

    likeCreated() {
      get(this, 'session.account').incrementProperty('likesGivenCount');
      invoke(this, 'trackEngagement', 'like');
    },

    deletePost() {
      if (get(this, 'post.isDeleted')) { return; }
      get(this, 'post').destroyRecord()
        .then(() => {
          // this post is being deleted from its permalink page
          if (get(this, 'group') === undefined) {
            get(this, 'router').transitionTo('dashboard');
          } else {
            // try to find the activity-group that references this post
            let record = get(this, 'store').peekRecord('activity-group', get(this, 'group.id'));
            // might be a new activity-group that doesn't have a set id
            if (record === null || record === undefined) {
              record = get(this, 'store').peekAll('activity-group')
                .find(group => get(group, 'activities').findBy('foreignId', `Post:${get(this, 'post.id')}`));
            }
            invokeAction(this, 'removeGroup', record);
          }
          get(this, 'notify').success('Success! Your post has been deleted.');
        })
        .catch((err) => {
          get(this, 'post').rollbackAttributes();
          get(this, 'notify').error(errorMessages(err));
        });
    },

    pinOrUnpinPost(post = null) {
      const user = get(this, 'session.account');
      set(user, 'pinnedPost', post);
      user.save().then(() => {
        const pastAction = (post === null) ? 'Your post has been unpinned.' : 'Your post has been pinned.';
        get(this, 'notify').success(`Success! ${pastAction}`);
      });
    }
  }
});
