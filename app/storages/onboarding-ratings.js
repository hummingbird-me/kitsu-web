import StorageArray from 'ember-local-storage/session/array';

const Storage = StorageArray.extend();

Storage.reopenClass({
  initialState() {
    return [];
  }
});

export default Storage;
