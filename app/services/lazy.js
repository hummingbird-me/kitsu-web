import Ember from 'ember';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { task } from 'ember-concurrency';
import service from 'ember-service/inject';
import RSVP from 'rsvp';

export default Ember.Service.extend({
  store: service(),

  collections: null,

  create(resource, multikey, include = null) {
    const collection = { targets: [] };

    if (include !== null) collection.include = include;
    collection.resource = resource;
    collection.multikey = multikey;
    collection.threshold = 0;
    collection.preloaded = 0;
    collection.waiting = [];

    get(this, 'collections').pushObject(collection);
    return (get(this, 'collections').length - 1);
  },

  add: task(function* (collectionId, target) {
    const collection = get(this, 'collections').objectAt(collectionId);
    collection.targets.addObject(target);

    if (collection.targets.length >= collection.threshold) {
      return yield get(this, 'resolve').perform(collectionId);
    }

    return yield get(this, 'await').perform(collectionId);
  }),

  await: task(function* (collectionId) {
    yield new RSVP.Promise((resolve) => {
      get(this, 'collections').objectAt(collectionId).waiting.addObject(resolve);
    });
  }),

  delete(collectionId) {
    get(this, 'collections').removeAt(collectionId);
  },

  resolve: task(function* (collectionId) {
    const collection = get(this, 'collections').objectAt(collectionId);
    const reference = collection.targets.objectAt(0);
    const multikey = collection.multikey;
    const finalFilter = {};
    finalFilter[multikey] = [];

    for (const key in reference) {
      if (key !== multikey) finalFilter[key] = reference[key];
    }

    for (const filter of collection.targets) {
      finalFilter[multikey].addObject(filter[multikey]);
    }

    return yield get(this, 'store').query(collection.resource, {
      filter: finalFilter,
      include: get(this, 'include')
    }).then((payload) => {
      collection.payload = payload;
      collection.preloaded = collection.threshold;
      collection.waiting.forEach(resolver => resolver());
    });
  }),

  fetch(collectionId) {
    return get(this, 'collections').objectAt(collectionId).payload;
  },

  setTreshold(collectionId, threshold) {
    get(this, 'collections').objectAt(collectionId).threshold = threshold;
  },

  init() {
    this._super(...arguments);
    set(this, 'collections', []);
  }
});
