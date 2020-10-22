import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get, set, computed, observer } from '@ember/object';
import { typeOf, isEmpty } from '@ember/utils';
import { capitalize } from '@ember/string';
import { invoke, invokeAction } from 'ember-invoke-action';
import { CanMixin } from 'ember-can';
import getter from 'client/utils/getter';
import ClipboardMixin from 'client/mixins/clipboard';
import errorMessages from 'client/utils/error-messages';

export default Component.extend(ClipboardMixin, CanMixin, {
  classNameBindings: ['post.isNew:new-post', 'isPinnedPost:pinned-post', 'post.id:stream-item'],
  classNames: ['row'],
  isHidden: false,
  showNsfw: false,
  showSpoilers: false,
  isFollowingPost: false,
  isPermalink: false,

  notify: service(),
  router: service(),
  store: service(),
  queryCache: service(),
  metrics: service(),
  host: getter(() => `${window.location.protocol}//${window.location.host}`),

  activity: getter(function() {
    return get(this, 'group.activities.firstObject');
  }),

  postUnitText: getter(function() {
    const unit = get(this, 'post.spoiledUnit');
    const title = get(unit, 'canonicalTitle');
    const placeHolderTitle = `${capitalize(get(unit, 'modelType'))} ${get(unit, 'number')}`;
    return isEmpty(title) || title === placeHolderTitle ? '' : `- ${title}`;
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

  didReceiveAttrs() {
    this._super(...arguments);

    set(this, 'isPermalink', get(this, 'router.currentRouteName') === 'posts');

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
    const hideNsfw = get(post, 'nsfw') && !get(this, 'showNsfw');
    const hideSpoilers = get(post, 'spoiler') && !(get(this, 'showSpoilers') && !get(post, 'spoiledUnit'));
    if (get(post, 'user') && get(this, 'session').isCurrentUser(get(post, 'user'))) {
      set(this, 'isHidden', hideNsfw);
    } else {
      set(this, 'isHidden', hideNsfw || hideSpoilers);
    }

    // groups
    if (get(post, 'id') && get(this, 'session.hasUser')) {
      const group = post.belongsTo('targetGroup').value();
      if (group) {
        if (get(this, 'kitsuGroupMembership')) {
          set(this, 'groupMembership', get(this, 'kitsuGroupMembership'));
        } else {
          get(this, 'queryCache').query('group-member', {
            filter: {
              group: get(group, 'id'),
              user: get(this, 'session.account.id')
            },
            include: 'permissions'
          }).then(records => {
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
  },

  _updateHidden: observer('post.nsfw', 'post.spoiler', function() {
    const post = get(this, 'post');
    set(this, 'isHidden', get(post, 'nsfw') || get(post, 'spoiler'));
  }),

  _updateFollow() {
    get(this, 'queryCache').query('post-follow', {
      filter: {
        user_id: get(this, 'session.account.id'),
        post_id: get(this, 'post.id')
      }
    }).then(records => {
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

    hideGroup(group) {
      get(this, 'store').query('group-member', {
        filter: {
          group: get(group, 'id'),
          user: get(this, 'session.account.id')
        }
      }).then(records => {
        const membership = get(records, 'firstObject');
        set(membership, 'hidden', true);
        membership.save()
          .then(() => {
            invokeAction(this, 'removeGroup', get(this, 'group'));
          })
          .catch(err => {
            get(this, 'notify').error(errorMessages(err));
            membership.rollbackAttributes();
          });
      });
    },

    hideUser(user) {
      const currentUser = get(this, 'session.account.id');
      get(this, 'store').query('follow', {
        filter: {
          follower: currentUser,
          followed: get(user, 'id')
        }
      }).then(records => {
        const follow = get(records, 'firstObject');
        set(follow, 'hidden', true);
        follow.save()
          .then(() => {
            invokeAction(this, 'removeGroup', get(this, 'group'));
          })
          .catch(err => {
            get(this, 'notify').error(errorMessages(err));
            follow.rollbackAttributes();
          });
      });
    },

    ignoreMedia(media) {
      const user = get(this, 'session.account');
      get(this, 'store').createRecord('media-ignore', {
        user, media
      }).save().then(() => {
        invokeAction(this, 'removeGroup', get(this, 'group'));
      }).catch(err => {
        get(this, 'notify').error(errorMessages(err));
      });
    },

    toggleHidden() {
      this.toggleProperty('isHidden');
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
        .catch(err => {
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
