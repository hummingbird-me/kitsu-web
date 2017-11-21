import DS from 'ember-data';

// Ember Data 2.15+ introduced changes to the query finder that caused the `links` object to be
// nullified. There is an open PR that fixes this behaviour -- #5240
export function initialize() {
  DS.AdapterPopulatedRecordArray.reopen({
    init() {
      const links = this.links;
      this._super(...arguments);
      this.links = links || null;
    }
  });
}

export default {
  name: 'ember-data-fix',
  initialize,
  after: 'ember-data'
};
