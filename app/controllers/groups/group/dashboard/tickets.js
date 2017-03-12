import Controller from 'ember-controller';
import set from 'ember-metal/set';
import { alias } from 'ember-computed';

export default Controller.extend({
  queryParams: ['filter', 'query'],
  filter: 'open',
  query: null,
  group: alias('model.group'),

  actions: {
    updateQueryParam(property, value) {
      set(this, property, value);
    }
  }
});
