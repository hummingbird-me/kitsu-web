export function initialize(app) {
  // sessions
  app.inject('controller', 'session', 'service:session');
  app.inject('component', 'session', 'service:session');
  app.inject('route', 'session', 'service:session');
  app.inject('ability', 'session', 'service:session');

  // intl
  app.inject('controller', 'intl', 'service:intl');
  app.inject('component', 'intl', 'service:intl');
  app.inject('route', 'intl', 'service:intl');
}

export default {
  name: 'service-injects',
  initialize
};
