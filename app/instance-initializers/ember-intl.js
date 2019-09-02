export function initialize(appInstance) {
  const intl = appInstance.lookup('service:intl');
  intl.setLocale('fr-fr');
}

export default {
  name: 'ember-intl',
  initialize
};
