import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  store: service(),

  createLibraryEntryTask: task(function* (status, rating) {
    const type = get(this, 'media.modelType');
    const libraryEntry = get(this, 'store').createRecord('library-entry', {
      status,
      rating,
      user: get(this, 'session.account'),
      [type]: get(this, 'media')
    });
    return yield libraryEntry.save();
  }).drop(),

  actions: {
    createLibraryEntry(status, rating) {
      if (!get(this, 'session.hasUser')) {
        return get(this, 'session').signUpModal();
      }
      get(this, 'createLibraryEntryTask').perform(status, rating).then((libraryEntry) => {
        invokeAction(this, 'onCreate', libraryEntry);
      });
    }
  }
});
