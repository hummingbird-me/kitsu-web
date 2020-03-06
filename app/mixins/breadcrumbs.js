import Mixin from '@ember/object/mixin';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { scheduleOnce } from '@ember/runloop';
import { classify } from '@ember/string';
import { hrefTo } from 'ember-href-to/helpers/href-to';

/**
 * Generate a BreadcrumbList schema for ember-cli-head.
 *
 * Some code here was heavily borrowed from ember-crumbly by poteto.
 */
export default Mixin.create({
  head: service('head-data'),

  init() {
    this._super(...arguments);
    this.on('routeDidChange', () => {
      scheduleOnce('afterRender', () => {
        const data = this._schemaData();
        const head = get(this, 'head');
        set(head, 'structuredData.meta-breadcrumbs', data);
      });
    });
  },

  _guessRoutePath(routeNames, name, index) {
    const routes = routeNames.slice(0, index + 1);
    if (routes.length === 1) {
      const path = `${name}.index`;
      return this._lookupRoute(path) ? path : name;
    }
    return routes.join('.');
  },

  _lookupRoute(routeName) {
    return getOwner(this).lookup(`route:${routeName}`);
  },

  _schemaData() {
    const data = {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [{
        '@type': 'ListItem',
        position: 1,
        item: {
          '@id': 'https://kitsu.io',
          name: 'Kitsu'
        }
      }]
    };
    const routeNames = get(this, 'currentRouteName').split('.');
    const filteredRouteNames = routeNames.reject(name => name === 'index');
    filteredRouteNames.forEach((name, index) => {
      const path = this._guessRoutePath(routeNames, name, index);
      const route = this._lookupRoute(path);
      if (!route) { return; } // route couldn't be found?
      const routeCrumb = get(route, 'breadcrumb');
      const breadcrumb = routeCrumb !== undefined ? routeCrumb : classify(name);
      if (breadcrumb === null) { return; }
      data.itemListElement.push({
        '@type': 'ListItem',
        position: data.itemListElement.length + 1,
        item: {
          '@id': `https://kitsu.io${hrefTo(this, path)}`,
          name: breadcrumb
        }
      });
    });
    return data;
  }
});
