/* eslint-disable no-param-reassign */
function _defineRoutes(server) {
  server.passthrough('/write-coverage');

  // authentication
  server.post('/api/oauth/token', {}, 200);

  // Forums
  server.get('https://forums.hummingbird.me/c/industry-news.json', {}, 200);

  // API Routes
  server.namespace = '/api/edge';

  server.get('/feeds/:type/:id', { data: [] }, 200);

  server.get('/anime');
  server.get('/anime/:id');

  server.get('/genres');
  server.get('/streamers');
  server.get('/reviews', { data: [] }, 200);
  server.get('/streaming-links', { data: [] }, 200);
  server.get('/media-follows', { data: [] }, 200);
  server.get('/library-entries', { data: [] }, 200);
  server.post('/library-entries');

  server.get('/users');
  server.get('/users/:id');
  server.post('/users');
}

// test
export function testConfig() {
  _defineRoutes(this);
}

// development
export default function() {
}
