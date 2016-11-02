import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import computed, { equal, alias } from 'ember-computed';
import service from 'ember-service/inject';
import { image } from 'client/helpers/image';
import { task } from 'ember-concurrency';
import run from 'ember-runloop';
import { invokeAction } from 'ember-invoke-action';

/**
 * This component should be invoked within a wormhole.
 */
export default Component.extend({
  session: service(),
  user: alias('session.account'),

  _component: 'about-me',
  componentName: computed('_component', {
    get() {
      return `modals/edit-profile/${get(this, '_component')}`;
    }
  }).readOnly(),

  coverImageStyle: computed('session.account.coverImage', {
    get() {
      const coverImage = image([get(this, 'session.account.coverImage')]);
      return `background-image: url("${coverImage}")`.htmlSafe();
    }
  }).readOnly(),

  isAboutActive: equal('_component', 'about-me'),
  isProfilesActive: equal('_component', 'linked-profiles'),
  isFavoritesActive: equal('_component', 'favorites'),

  updateProfileTask: task(function* () {
    const user = get(this, 'session.account');
    return yield user.save();
  }).restartable(),

  actions: {
    onClose() {
      invokeAction(this, 'onClose');
    },

    changeComponent(component) {
      set(this, '_component', component);
      this.$('.modal').data('bs.modal')._handleUpdate();
    },

    triggerClick(elementId) {
      this.$(`#${elementId}`).click();
    },

    updateProfile() {
      // TODO: Show potential error to user.
      get(this, 'updateProfileTask').perform()
        .then(() => this.$('.modal').modal('hide'))
        .catch(() => get(this, 'user').rollbackAttributes());
    },

    updateImage(property, event) {
      if (event.files && event.files[0]) {
        const reader = new FileReader();
        reader.onload = evt => run(() => set(this, property, evt.target.result));
        reader.readAsDataURL(event.files[0]);
      }
    }
  }
});
