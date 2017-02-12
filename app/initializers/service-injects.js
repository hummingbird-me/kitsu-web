export function initialize(app) {
  // sessions
  app.inject('controller', 'session', 'service:session');
  app.inject('component', 'session', 'service:session');
  app.inject('route', 'session', 'service:session');
  app.inject('ability', 'session', 'service:session');
}

export default {
  name: 'service-injects',
  initialize
};
