import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  classNames: ['tab-pane'],
  store: service(),
  queryCache: service(),

  init() {
    this._super(...arguments);
    get(this, 'getSites').perform().then(sites => {
      const data = sites.map(site => {
        let profileLink = get(this, 'user.profileLinks').findBy('site.name', get(site, 'name'));
        if (profileLink !== undefined) {
          if (!get(profileLink, 'isNew')) {
            invokeAction(this, 'addRecord', profileLink);
          }
        } else {
          profileLink = get(this, 'store').createRecord('profile-link', {
            site,
            user: get(this, 'user')
          });
        }
        return profileLink;
      });
      set(this, 'availableLinks', data);
      set(this, 'currentLink', data.findBy('site.name', 'Website') || get(data, 'firstObject'));
    }).catch(() => {});
  },

  getSites: task(function* () {
    return yield get(this, 'queryCache').query('profile-link-site', { page: { limit: 50 } });
  }).drop(),

  actions: {
    updateProfileLink(link, content) {
      // add or remove from meta record list if this is a new record
      if (get(link, 'isNew')) {
        const action = isEmpty(content) ? 'removeRecord' : 'addRecord';
        invokeAction(this, action, link);
      } else if (get(link, 'isDeleted')) {
        link.rollbackAttributes();
      }
      // update the URL content
      set(link, 'url', content);
    },

    removeProfileLink(link) {
      set(link, 'url', null);
      link.deleteRecord();
    }
  }
});
