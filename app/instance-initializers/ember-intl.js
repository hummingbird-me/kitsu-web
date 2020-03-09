export function initialize(appInstance) {
  const intl = appInstance.lookup('service:intl');
  intl.setLocale('en-US');
}

export default {
  name: 'ember-intl',
  initialize
};
