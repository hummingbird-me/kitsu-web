import Ember from 'ember';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { scheduleOnce } from 'ember-runloop';
import service from 'ember-service/inject';
import RSVP from 'rsvp';

export default Ember.Service.extend({
  store: service(),
  _registry: {},

  query(entry, resource, filter) {
    let collection = get(this, '_registry')[entry];

    if (collection === undefined) {
      collection = this._register(entry, resource, filter.isRelationship);
      scheduleOnce('afterRender', this, '_resolve', entry);
    }

    collection.objects.addObject(filter);

    return new RSVP.Promise((resolve, reject) => {
      collection.promises.addObject([resolve, reject]);
    });
  },

  _resolve(entry) {
    const collection = get(this, '_registry')[entry];
    const storeFilter = {};
    let multikey = '';

    collection.objects.forEach((condition) => {
      Object.keys(condition.filter).forEach((filter) => {
        const val = condition.filter[filter];

        if (storeFilter[filter] === undefined) storeFilter[filter] = [val];
        else storeFilter[filter].addObject(val);
      });
    });

    Object.keys(storeFilter).forEach((key) => {
      if (storeFilter[key].length === 1) storeFilter[key] = storeFilter[key][0];
      else multikey = key;
    });

    const filterkey = (collection.isRelationship) ? `${multikey}.id` : multikey;

    return get(this, 'store').query(collection.resource, {
      filter: storeFilter,
      include: collection.objects.objectAt(0).include
    }).then((payload) => {
      collection.promises.forEach(([resolve, reject], i) => {
        const filter = collection.objects[i].filter;
        resolve(payload.filter(condition => filter[multikey] === get(condition, filterkey)));
      });
    });
  },

  _register(entry, resource, isRelationship) {
    return set(get(this, '_registry'), entry, {
      resource,
      isRelationship,
      objects: [],
      promises: []
    });
  }
});
