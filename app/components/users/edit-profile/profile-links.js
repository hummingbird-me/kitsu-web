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
      const data = sites.toArray().map((site) => {
        const profileLink = get(this, 'user.profileLinks').findBy('site.name', get(site, 'name'));
        if (profileLink !== undefined) {
          invokeAction(this, 'addRecord', profileLink);
        }
        return { site, profile: profileLink, hasProfile: profileLink !== undefined };
      });
      set(this, 'availableLinks', [this._createWebsiteLink(), ...data]);
    }).catch(() => {});
  },

  _createWebsiteLink() {
    if (get(this, 'websiteLink')) { return get(this, 'websiteLink'); }
    const website = get(this, 'store').createRecord('profile-link', {
      url: get(this, 'user.website'),
      site: { name: 'Website' }
    });
    const hasProfile = get(this, 'user.website');
    const data = { site: { name: 'Website' }, profile: website, hasProfile };
    return set(this, 'websiteLink', data);
  },

  actions: {
    updateProfileLink(content) {
      const currentLink = get(this, 'currentLink');
      if (get(currentLink, 'site.name') === 'Website') {
        set(this, 'user.website', isEmpty(content) ? null : content);
        set(currentLink, 'profile.url', get(this, 'user.website'));
      } else {
        let profile = get(currentLink, 'profile');
        if (profile === undefined) {
          profile = get(this, 'store').createRecord('profile-link', {
            profileLinkSite: get(currentLink, 'site'),
            user: get(this, 'user')
          });
          set(currentLink, 'profile', profile);
        }
        if (isEmpty(content)) {
          invokeAction(this, 'removeRecord', profile);
        } else {
          invokeAction(this, 'addRecord', profile);
        }
        set(profile, 'url', content);
      }
    }
  }
});
