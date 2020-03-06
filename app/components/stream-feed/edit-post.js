import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';
import { all } from 'rsvp';

export default Component.extend({
  notify: service(),
  store: service(),

  updatePost: task(function* (content, options) {
    const post = get(this, 'post');
    set(post, 'content', content);
    Object.keys(options).forEach(option => {
      set(post, option, get(options, option));
    });

    try {
      yield post.save();
      yield all(options.uploads.filterBy('hasDirtyAttributes').map(upload => upload.save()));
      this.$('.modal').modal('hide');
    } catch (error) {
      console.error(error);
      post.rollbackAttributes();
      get(this, 'notify').error(errorMessages(error));
    }
  }).drop()
});
