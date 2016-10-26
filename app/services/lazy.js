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
    const collection = {
      resource,
      multikey,
      threshold: 0,
      preloaded: 0,
      waiting: [],
      targets: []
    };

    if (include !== null) collection.include = include;

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

    Object.keys(reference).forEach((key) => {
      if (key !== multikey) finalFilter[key] = reference[key];
    });

    for (let i = get(this, 'preloaded'); i < get(this, 'threshold'); i += 1) {
      const filter = collection.targets.objectAt(i);
      if (filter === undefined) break;

      finalFilter[multikey].addObject(filter[multikey]);
    }

    return yield get(this, 'store').query(collection.resource, {
      filter: finalFilter,
      include: get(this, 'include')
    }).then((payload) => {
      collection.payload = payload;
      collection.preloaded = collection.threshold;
      collection.waiting.forEach(resolver => resolver());
      collection.waiting = [];
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
