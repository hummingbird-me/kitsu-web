import Router from '@ember/routing/router';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import RouterScroll from 'ember-router-scroll';
import Breadcrumbs from 'client/mixins/breadcrumbs';
import config from 'client/config/environment';

const RouterInstance = Router.extend(RouterScroll, Breadcrumbs, {
  location: config.locationType,
  rootURL: config.rootURL,

  metrics: service(),
  head: service('head-data'),

  willTransition() {
    this._super(...arguments);
    this._resetStructuredData();
  },

  didTransition() {
    this._super(...arguments);
    this._trackPage();
  },

  setTitle(title) {
    const head = get(this, 'head');
    set(head, 'title', title);
  },

  /**
   * Send a page event to our metric services
   */
  _trackPage() {
    scheduleOnce('afterRender', () => {
      const page = get(this, 'url');
      const title = get(this, 'head.title') || get(this, 'currentRouteName');
      get(this, 'metrics').trackPage({ page, title });
    });
  },

  /**
   * Reset the structured data (ld+json) back to empty.
   */
  _resetStructuredData() {
    const head = get(this, 'head');
    set(head, 'structuredData', {});
  }
});

// eslint-disable-next-line array-callback-return
RouterInstance.map(function() {
  this.route('dashboard', { path: '/' });
  this.route('dashboard/redirect', { path: '/dashboard' });

  this.route('explore', { path: '/explore/:media_type' }, function() {
    this.route('more', { path: '/:type' });
    this.route('category', { path: '/category/:slug' }, function() {
      this.route('more', { path: '/:type' });
    });
  });

  ['anime', 'manga'].forEach(media => {
    this.route(media, function() {
      this.route('show', { path: '/:slug' }, function() {
        const units = media === 'anime' ? 'episodes' : 'chapters';
        this.route(units, function() {
          this.route('show', { path: '/:number' });
        });
        this.route('characters');
        this.route('reactions');
        this.route('franchise');
      });
    });
  });

  this.route('groups', function() {
    this.route('new');
    this.route('group', { path: '/:slug' }, function() {
      this.route('group-page', { path: '/' }, function() {
        this.route('rules');
        this.route('members');
        this.route('leaders');
      });
      this.route('dashboard', function() {
        this.route('reports');
        this.route('tickets');
        this.route('members');
        this.route('leaders');
        this.route('settings');
      });
    });
  });
  this.route('group-invite', { path: '/group-invite/:id' });

  this.route('users', { path: '/users/:slug' }, function() {
    this.route('library');
    this.route('reviews'); // Legacy
    this.route('reactions');
    this.route('followers');
    this.route('following');
    this.route('groups');
  });

  this.route('settings', function() {
    this.route('index', { path: '/profile' });
    this.route('notifications');
    this.route('password');
    this.route('privacy');
    this.route('linked-accounts');
    this.route('imports');
    this.route('exports');
    this.route('blocking');
    this.route('account');
  });

  this.route('feedback', function() {
    this.route('bugs');
    this.route('bugs-anything', { path: '/bugs/*path' });
    this.route('feature-requests');
    this.route('feature-requests-anything', { path: '/feature-requests/*path' });
    this.route('database-requests');
    this.route('database-requests-anything', { path: '/database-requests/*path' });
    this.route('mobile-bugs');
    this.route('mobile-bugs-anything', { path: '/mobile-bugs/*path' });
    this.route('mobile-features');
    this.route('mobile-features-anything', { path: '/mobile-features/*path' });
  });

  this.route('admin', function() {
    this.route('reports', function() {
      this.route('index', { path: '/open' });
      this.route('closed');
    });
  });

  this.route('posts', { path: '/posts/:id' });
  this.route('comments', { path: '/comments/:id' });
  this.route('reviews', { path: '/reviews/:id' });
  this.route('media-reactions', { path: '/media-reactions/:id' });
  this.route('notifications');

  this.route('password-reset');
  this.route('confirm-email');
  this.route('unsubscribe');

  this.route('terms');
  this.route('pro');

  // These must remain at the bottom of the RouterInstance map
  this.route('server-error', { path: '/500' });
  this.route('not-found', { path: '/*path' });
});

export default RouterInstance;
