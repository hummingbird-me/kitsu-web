import Controller from 'ember-controller';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed, { alias } from 'ember-computed';

export default Controller.extend({
  queryParams: ['filter', 'query'],
  filter: 'open',
  query: null,
  group: alias('model.group'),
  membership: alias('model.membership'),

  addedTickets: computed('_addedTickets', function() {
    return get(this, '_addedTickets');
  }).readOnly(),

  actions: {
    updateQueryParam(property, value) {
      set(this, property, value);
    },

    onTicketCreated(ticket) {
      get(this, '_addedTickets').addObject(ticket);
    }
  }
});
