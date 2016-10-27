import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { invokeAction } from 'ember-invoke-action';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['stream-item-comments'],
  session: service(),
  store: service(),

  getComments: task(function* () {
    return yield get(this, 'store').query('comment', {
      filter: { post_id: get(this, 'post.id') },
      page: { limit: 2 },
      include: 'user',
      sort: '-created_at'
    });
  }).drop(),

  createComment: task(function* (content) {
    if (get(this, 'readOnly') === true) {
      return get(this, 'session.signUpModal')();
    }

    this.$('.add-comment').val('');
    const comment = get(this, 'store').createRecord('comment', {
      content,
      post: get(this, 'post'),
      user: get(this, 'session.account')
    });
    get(this, 'comments').insertAt(0, comment);
    yield comment.save().then((record) => {
      invokeAction(this, 'onCreate', record);
    }).catch(() => {
      get(this, 'comments').removeObject(comment);
      invokeAction(this, 'onError', comment);
    });
  }).drop(),

  init() {
    this._super(...arguments);
    get(this, 'getComments').perform().then((comments) => {
      const content = comments.toArray();
      set(content, 'links', get(comments, 'links'));
      set(this, 'comments', content);
    });
  },

  actions: {
    loadComments(records, links) {
      const content = get(this, 'comments').toArray();
      content.addObjects(records);
      set(this, 'comments', content);
      set(this, 'comments.links', links);
    }
  }
});
