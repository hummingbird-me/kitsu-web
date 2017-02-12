import PowerSelectComponent from 'ember-power-select/components/power-select';
import computed from 'ember-computed';
import get from 'ember-metal/get';

// Override `ember-power-select` to support intl messages
export default PowerSelectComponent.extend({
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
