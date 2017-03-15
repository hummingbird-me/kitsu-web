import Ember from 'ember';
import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { isEmpty } from 'ember-utils';
import { task, timeout } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';

const {
  Inflector: { inflector }
} = Ember;

const dataTask = (type, key, fields) => (
  task(function* (query) {
    return yield get(this, 'store').query(type, {
      filter: { [key]: query },
      fields: { [inflector.pluralize(type)]: fields.join(',') },
      page: { limit: 2 }
    });
  }).restartable()
);

export default Component.extend({
  isOpened: false,
  metrics: service(),
  store: service(),

  init() {
    this._super(...arguments);
    set(this, 'groups', { anime: [], manga: [], groups: [], users: [] });
  },

  didReceiveAttrs() {
    this._super(...arguments);
    const query = get(this, 'query');
    if (isEmpty(query) || get(this, 'queryWas') === query) {
      return;
    }
    set(this, 'queryWas', query);
    get(this, 'searchTask').perform(query).then(() => {
      get(this, 'metrics').trackEvent({ category: 'search', action: 'query', label: query });
    }).catch((error) => {
      get(this, 'raven').captureException(error);
    });
  },

  searchTask: task(function* (query) {
    yield timeout(250);
    const groupTypes = Object.keys(get(this, 'groups'));
    groupTypes.forEach((type) => {
      get(this, `${type}Task`).perform(query).then((records) => {
        set(this, `groups.${type}`, records);
      }).catch((error) => {
        get(this, 'raven').captureException(error);
      });
    });
  }).restartable(),

  animeTask: dataTask('anime', 'text', ['slug', 'canonicalTitle', 'titles', 'posterImage']),
  mangaTask: dataTask('manga', 'text', ['slug', 'canonicalTitle', 'titles', 'posterImage']),
  groupsTask: dataTask('group', 'query', ['slug', 'name', 'avatar']),
  usersTask: dataTask('user', 'query', ['name', 'avatar']),

  actions: {
    close() {
      set(this, 'isOpened', false);
      invokeAction(this, 'onClose');
    },

    updatePage(records) {
      const copy = get(this, 'groups.users').toArray();
      copy.addObjects(records);
      set(copy, 'links', get(records, 'links'));
      set(this, 'groups.users', copy);
    }
  }
});
