import Mixin from 'ember-metal/mixin';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import Route from 'ember-route';
import RSVP from 'rsvp';
import Ember from 'ember';

const {
  Inflector: { inflector }
} = Ember;

export default Mixin.create({
  init() {
    this._super(...arguments);
    set(this, 'paginatedElements', []);
    set(this, 'internalPageState', {
      hasNextPage: false,
      nextPageLink: null
    });
  },

  hasNextPage() {
    return get(this, 'internalPageState.hasNextPage');
  },

  updatePageState(records) {
    const hasNextPage = 'next' in (get(records, 'links') || {});
    set(this, 'internalPageState.hasNextPage', hasNextPage);
    set(this, 'internalPageState.nextPageLink', hasNextPage ?
      get(records, 'links.next') : null);
  },

  onPagination(records) {
    if (this instanceof Route) {
      const controller = this.controllerFor(get(this, 'routeName'));
      get(controller, 'model.paginatedElements').addObjects(records);
    } else {
      get(this, 'paginatedElements').addObjects(records);
    }
  },

  actions: {
    /** Execute a pagination request. This must be overriden by the consumer. */
    onPagination(recordType, customOptions = {}) {
      const hasNextPage = this.hasNextPage();
      if (!hasNextPage) { return RSVP.resolve(); }
      const options = Object.assign(this._getPaginationRequestOptions(), customOptions);
      const modelName = recordType || this._getPaginationRecordType();
      return get(this, 'store').query(modelName, options).then((records) => {
        this.onPagination(records);
        this.updatePageState(records);
      });
    }
  },

  _getPaginationRequestOptions() {
    const nextPageLink = get(this, 'internalPageState.nextPageLink');
    const decodedLink = window.decodeURI(nextPageLink);
    const splitLink = decodedLink.split('?');
    if (splitLink.length !== 2) {
      return {};
    }
    const queryParams = splitLink[1].split('&');
    const options = {};
    queryParams.forEach((param) => {
      // eslint-disable-next-line prefer-const
      let [key, value] = param.split('=');
      if (key.includes('[')) {
        // eslint-disable-next-line no-unused-vars
        const [_, parent, child] = key.match(/(.+)\[(.+)\]/);
        options[parent] = options[parent] || {};
        options[parent][child] = decodeURIComponent(value);
      } else {
        options[key] = decodeURIComponent(value);
      }
    });
    return options;
  },

  _getPaginationRecordType() {
    const nextPageLink = get(this, 'internalPageState.nextPageLink');
    const decodedLink = window.decodeURI(nextPageLink);
    const [URL] = decodedLink.split('?');
    return inflector.singularize(get(URL.split('/'), 'lastObject'));
  }
});
