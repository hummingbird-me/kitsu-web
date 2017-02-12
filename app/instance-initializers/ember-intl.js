export function initialize(app) {
  const intl = app.lookup('service:intl');
  intl.setLocale('en-us');
}

export default {
  name: 'ember-intl',
  initialize
};
