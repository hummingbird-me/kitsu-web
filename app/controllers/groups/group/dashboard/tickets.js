import Controller from '@ember/controller';
import { set } from '@ember/object';
import { alias } from '@ember/object/computed';
import QueryParams from 'ember-parachute';

const queryParams = new QueryParams({
  filter: {
    defaultValue: 'open'
  },
  query: {
    defaultValue: ''
  }
});

export default Controller.extend(queryParams.Mixin, {
  group: alias('model.group'),

  actions: {
    updateQueryParam(property, value) {
      set(this, property, value);
    }
  }
});
