import Component from 'ember-power-select/components/power-select';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Component.extend({
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
