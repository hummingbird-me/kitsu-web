import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { isEmpty, isPresent } from 'ember-utils';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  notify: service(),
  store: service(),

  updatePost: task(function* (content, options) {
    const post = get(this, 'post');
    set(post, 'content', content);
    Object.keys(options).forEach((option) => {
      set(post, option, get(options, option));
    });

    // don't update spoiled unit if it already exists
    if (isEmpty(get(post, 'spoiledUnit.content')) === true) {
      if (get(post, 'spoiler') === true && isPresent(get(post, 'media.content')) === true) {
        const type = get(post, 'media.modelType');
        const entry = yield get(this, 'store').query('library-entry', {
          filter: {
            user_id: get(post, 'user.id'),
            kind: type,
            [`${type}_id`]: get(post, 'media.id')
          },
          include: 'unit'
        }).then(records => get(records, 'firstObject'));
        if (entry) {
          set(post, 'spoiledUnit', get(entry, 'unit'));
        }
      }
    } else if (!get(post, 'spoiler')) {
      set(post, 'spoiledUnit', null);
    }

    return yield post.save()
      .then(() => this.$('.modal').modal('hide'))
      .catch((err) => {
        post.rollbackAttributes();
        get(this, 'notify').error(errorMessages(err));
      });
  }).drop()
});
