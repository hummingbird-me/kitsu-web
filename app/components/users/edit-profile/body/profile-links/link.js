import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import service from 'ember-service/inject';
import { invokeAction } from 'ember-invoke-action';
import { profileLinkToSVG } from 'client/helpers/profile-link-to-svg';

export default Component.extend({
  i18n: service(),

  placeholder: computed('link.site.name', function() {
    let siteName = get(this, 'link.site.name');
    siteName = profileLinkToSVG([siteName]);
    return get(this, 'i18n').t(`users.edit.profileLink.${siteName}`);
  }).readOnly(),

  actions: {
    update(content) {
      invokeAction(this, 'update', get(this, 'link'), content);
    },

    remove() {
      invokeAction(this, 'remove', get(this, 'link'));
    }
  }
});
