export function initialize(appInstance) {
  const intl = appInstance.lookup('service:intl');
  intl.setLocale('en-us');
}

export default {
  name: 'ember-intl',
  initialize
};
