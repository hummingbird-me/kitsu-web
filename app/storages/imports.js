import StorageObject from 'ember-local-storage/session/object';

// Keeps the most recent username used for a list import
const Storage = StorageObject.extend();

Storage.reopenClass({
  initialState() {
    return { username: null };
  }
});

export default Storage;
