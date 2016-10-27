import Service from 'ember-service';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { scheduleOnce } from 'ember-runloop';
import service from 'ember-service/inject';
import RSVP from 'rsvp';

/**
 * TODO: This either needs a massive refactor to work without being dependent
 * on a included property, or we need to remove this and rework the areas where
 * its currently used.
 */
export default Service.extend({
  store: service(),
  _registry: {},

  query(entry, resource, compare, options) {
    let collection = get(this, '_registry')[entry];
    if (collection === undefined) {
      collection = this._register(entry, resource, compare);
      scheduleOnce('afterRender', this, '_resolve', entry);
    }
    collection.objects.addObject(options);
    return new RSVP.Promise((resolve, reject) => {
      collection.promises.addObject([resolve, reject]);
    });
  },

  _resolve(entry) {
    const collection = get(this, '_registry')[entry];
    const filter = {};
    collection.objects.forEach((object) => {
      Object.keys(object.filter).forEach((key) => {
        filter[key] = filter[key] || [];
        filter[key].addObject(object.filter[key]);
      });
    });
    Object.keys(filter).forEach((key) => { filter[key] = filter[key].join(','); });
    return get(this, 'store').query(collection.resource, {
      filter,
      include: collection.objects[0].include // TODO: Join these too?
    })
    .then((records) => {
      collection.promises.forEach(([resolve], index) => {
        const object = collection.objects[index].filter;
        resolve(records.filter(record => (
          object[collection.compare.filterKey] === get(record, collection.compare.lookupKey))
        ));
      });
    })
    .catch(error => collection.promises.forEach(methods => methods[1](error)))
    .finally(() => {
      delete get(this, '_registry')[entry];
    });
  },

  _register(entry, resource, compare) {
    return set(get(this, '_registry'), entry, {
      resource,
      compare,
      objects: [],
      promises: []
    });
  }
});
