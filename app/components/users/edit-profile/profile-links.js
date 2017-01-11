import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import { isEmpty } from 'ember-utils';

export default Component.extend({
  store: service(),
  getSites: task(function* () {
    return yield get(this, 'store').query('profile-link-site', { page: { limit: 20 } });
  }).keepLatest(),

  init() {
    this._super(...arguments);
    set(this, 'currentLink', this._createWebsiteLink());
    get(this, 'getSites').perform().then((sites) => {
      const data = sites.map((site) => {
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
      data.unshiftObject(this._createWebsiteLink());
      set(this, 'availableLinks', data);
    }).catch(() => {});
  },

  /**
   * Create local ember-data record for a Website profile link as the website is stored
   * on the user model rather than as a ProfileLink on the backend
   */
  _createWebsiteLink() {
    if (get(this, 'websiteLink')) { return get(this, 'websiteLink'); }
    const website = get(this, 'store').createRecord('profile-link', {
      url: get(this, 'user.website')
    });
    const site = get(this, 'store').createRecord('profile-link-site', {
      name: 'Website'
    });
    set(website, 'site', site);
    return set(this, 'websiteLink', website);
  },

  actions: {
    updateProfileLink(link, content) {
      // since website is on the user model, we need to handle it differently here
      if (get(link, 'site.name') === 'Website') {
        // null so that we don't dirty the user record by using an empty string
        set(this, 'user.website', isEmpty(content) ? null : content);
        set(link, 'url', get(this, 'user.website'));
      } else {
        // add or remove from meta record list if this is a new record
        if (get(link, 'isNew')) {
          const action = isEmpty(content) ? 'removeRecord' : 'addRecord';
          invokeAction(this, action, link);
        }
        // update the URL content
        set(link, 'url', content);
      }
    },

    removeProfileLink(link) {
      set(link, 'url', null);
      if (get(link, 'site.name') === 'Website') {
        set(this, 'user.website', null);
      } else {
        link.deleteRecord();
      }
    }
  }
});
