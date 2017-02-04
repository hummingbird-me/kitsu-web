import StorageObject from 'ember-local-storage/session/object';

const Storage = StorageObject.extend();

Storage.reopenClass({
  initialState() {
    return {};
  }
});

export default Storage;
