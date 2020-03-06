import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import { scheduleOnce } from '@ember/runloop';
import request from 'ember-ajax/request';
import { imgixUrl } from 'client/helpers/imgix-url';
import errorMessages from 'client/utils/error-messages';
import getter from 'client/utils/getter';
import ClipboardMixin from 'client/mixins/clipboard';
import { unshiftObjects } from 'client/utils/array-utils';
import Pagination from 'kitsu-shared/mixins/pagination';
import { CanMixin } from 'ember-can';

export default Component.extend(ClipboardMixin, Pagination, CanMixin, {
  classNameBindings: ['comment.isNew:new-comment'],
  upload: undefined,
  isEditing: false,
  isReplying: false,
  isTopLevel: false,
  metrics: service(),
  notify: service(),
  store: service(),
  queryCache: service(),
  host: getter(() => `${window.location.protocol}//${window.location.host}`),

  commentEdited: computed('comment.createdAt', 'comment.editedAt', function() {
    if (!get(this, 'comment.editedAt')) { return false; }
    return !get(this, 'comment.createdAt').isSame(get(this, 'comment.editedAt'));
  }).readOnly(),

  canEditComment: computed(function() {
    const group = get(this, 'post').belongsTo('targetGroup').value();
    if (group) {
      return this.can('edit comment in group', group, {
        membership: get(this, 'groupMembership'),
        comment: get(this, 'comment')
      });
    }
    return this.can('edit comment', get(this, 'comment'));
  }).readOnly(),

  getReplies: task(function* () {
    return yield this.queryPaginated('comment', {
      include: 'user,uploads',
      filter: { post_id: get(this, 'post.id'), parent_id: get(this, 'comment.id') },
      fields: { users: ['avatar', 'name', 'slug'].join(',') },
      page: { limit: 2 },
      sort: '-created_at'
    }, { cache: false });
  }).drop(),

  createReply: task(function* (content, embedUrl = undefined) {
    const data = {
      content,
      embedUrl,
      post: get(this, 'post'),
      parent: get(this, 'comment'),
      user: get(this, 'session.account'),
    };
    const upload = get(this, 'upload');
    if (upload) {
      data.uploads = [upload];
    }
    const reply = get(this, 'store').createRecord('comment', data);

    invokeAction(this, 'replyCountUpdate', get(this, 'comment.repliesCount') + 1);
    get(this, 'replies').addObject(reply);
    set(this, 'isReplying', false);

    yield reply.save()
      .then(() => {
        invokeAction(this, 'trackEngagement', 'comment');
        get(this, 'metrics').trackEvent({ category: 'comment', action: 'reply', value: get(this, 'comment.id') });
      })
      .catch(err => {
        invokeAction(this, 'replyCountUpdate', get(this, 'comment.repliesCount') - 1);
        get(this, 'replies').removeObject(reply);
        get(this, 'notify').error(errorMessages(err));
      });
  }).drop(),

  updateComment: task(function* () {
    yield get(this, 'comment').save().catch(err => get(this, 'notify').error(errorMessages(err)));
  }).drop(),

  init() {
    this._super(...arguments);
    set(this, 'replies', []);
    set(this, 'galleryItems', []);
    if (get(this, 'isTopLevel') === true && get(this, 'comment.repliesCount') > 0) {
      get(this, 'getReplies').perform().then(replies => {
        const content = replies.toArray().reverse();
        set(content, 'links', get(replies, 'links'));
        set(this, 'replies', content);
      }).catch(() => {});
    }

    // uploads
    const upload = get(this, 'comment.uploads.firstObject');
    if (upload) {
      const src = get(upload, 'content.original');
      const jsonUrl = imgixUrl([src, { fm: 'json' }]);
      const thumbSrc = imgixUrl([src, { 'max-h': 200 }]);
      request(jsonUrl).then(data => set(this, 'galleryItems', [{
        src, thumbSrc, w: data.PixelWidth, h: data.PixelHeight, type: data['Content-Type']
      }]));
    }

    // groups
    const group = get(this, 'post').belongsTo('targetGroup').value();
    if (group && get(this, 'session.hasUser')) {
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
  },

  onPagination(records) {
    set(this, 'isLoading', false);
    unshiftObjects(get(this, 'replies'), records.toArray().reverse());
    invokeAction(this, 'trackEngagement', 'click');
  },

  actions: {
    updateComment(component, event, content) {
      if (isEmpty(content) === true) { return; }
      const { shiftKey } = event;
      if (shiftKey === false) {
        event.preventDefault();
        get(this, 'updateComment').perform();
        this.toggleProperty('isEditing');
      }
    },

    deleteComment() {
      get(this, 'comment').destroyRecord()
        .then(() => {
          invokeAction(this, 'onDelete', get(this, 'comment'));
          get(this, 'notify').success('Success! Your comment has been deleted.');
        })
        .catch(err => {
          get(this, 'comment').rollbackAttributes();
          get(this, 'notify').error(errorMessages(err));
        });
    },

    deletedReply(reply) {
      get(this, 'replies').removeObject(reply);
      invokeAction(this, 'replyCountUpdate', get(this, 'comment.repliesCount') - 1);
    },

    showReply() {
      if (get(this, 'isTopLevel') === true) {
        this.toggleProperty('isReplying');
      } else {
        const mention = get(this, 'comment.user.slug') || get(this, 'comment.user.id');
        invokeAction(this, 'onReply', mention);
      }
    },

    onReply(slug) {
      this.toggleProperty('isReplying');
      scheduleOnce('afterRender', () => this.$('.reply-comment').val(`@${slug} `));
    },

    onPagination() {
      set(this, 'isLoading', true);
      this._super(null, { page: { limit: 10, offset: get(this, 'replies.length') } });
    },

    loadReplies(records, links) {
      const content = get(this, 'replies').toArray();
      unshiftObjects(content, records.toArray().reverse());
      set(this, 'replies', content);
      set(this, 'replies.links', links);
    },

    trackEngagement(label) {
      invokeAction(this, 'trackEngagement', label, `Comment:${get(this, 'comment.id')}`);
    }
  }
});
