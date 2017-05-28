import Controller from 'ember-controller';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { alias } from 'ember-computed';
import QueryParams from 'ember-parachute';

const queryParams = new QueryParams({
  filter: {
    defaultValue: 'open',
  },
  query: {
    defaultValue: ''
  },
  preserveScrollPosition: {
    defaultValue: true
  }
});

export default Controller.extend(queryParams.Mixin, {
  group: alias('model.group'),
  membership: alias('model.membership'),
  addedTickets: alias('_addedTickets'),

  actions: {
    updateQueryParam(property, value) {
      set(this, property, value);
    },

    onTicketCreated(ticket) {
      get(this, 'addedTickets').addObject(ticket);
    }
  }
});
