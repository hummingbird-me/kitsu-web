import PowerSelectComponent from 'ember-power-select/components/power-select';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';

// Override `ember-power-select` to support intl messages
export default PowerSelectComponent.extend({
  intl: service(),

  loadingMessage: computed('intl.locale', function() {
    return get(this, 'intl').t('selects.loading');
  }),

  noMatchesMessage: computed('intl.locale', function() {
    return get(this, 'intl').t('selects.none');
  }),

  searchMessage: computed('intl.locale', function() {
    return get(this, 'intl').t('selects.search');
  })
});
