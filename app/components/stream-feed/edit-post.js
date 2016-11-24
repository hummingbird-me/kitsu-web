import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';
import { task } from 'ember-concurrency';
import { isEmpty, isPresent } from 'ember-utils';
import { modelType } from 'client/helpers/model-type';
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
        const entry = yield get(this, 'store').query('library-entry', {
          filter: {
            user_id: get(post, 'user.id'),
            media_type: capitalize(modelType([get(post, 'media')])),
            media_id: get(post, 'media.id')
          },
          include: 'unit'
        });
        set(post, 'spoiledUnit', get(entry, 'unit'));
      }
    }

    return yield post.save()
      .then(() => this.$('.modal').modal('hide'))
      .catch((err) => {
        post.rollbackAttributes();
        get(this, 'notify').error(errorMessages(err));
      });
  }).drop()
});
