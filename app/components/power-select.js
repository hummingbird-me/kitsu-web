import PowerSelectComponent from 'ember-power-select/components/power-select';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import get from 'ember-metal/get';

// Override `ember-power-select` to support i18n messages
export default PowerSelectComponent.extend({
  i18n: service(),

  loadingMessage: computed('i18n.locale', {
    get() {
      return get(this, 'i18n').t('selects.loading');
    }
  }),

  noMatchesMessage: computed('i18n.locale', {
    get() {
      return get(this, 'i18n').t('selects.none');
    }
  }),

  searchMessage: computed('i18n.locale', {
    get() {
      return get(this, 'i18n').t('selects.search');
    }
  })
});
