import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import computed, { equal, alias, filterBy } from 'ember-computed';
import service from 'ember-service/inject';
import { image } from 'client/helpers/image';
import { task } from 'ember-concurrency';
import run from 'ember-runloop';
import { invokeAction } from 'ember-invoke-action';
import RSVP from 'rsvp';

export default Component.extend({
  errorMessage: undefined,

  i18n: service(),
  router: service('-routing'),
  session: service(),
  user: alias('session.account'),

  _component: 'about-me',
  componentName: computed('_component', {
    get() {
      return `users/edit-profile/${get(this, '_component')}`;
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
  isDirty: filterBy('records', 'hasDirtyAttributes'),

  updateProfileTask: task(function* () {
    const records = get(this, 'records');
    const saving = records.filterBy('hasDirtyAttributes').map(record => record.save());
    return yield new RSVP.Promise((resolve, reject) => {
      RSVP.allSettled(saving).then((data) => {
        const failed = data.filterBy('state', 'rejected');
        return failed.length > 0 ? reject() : resolve();
      });
    });
  }).restartable(),

  init() {
    this._super(...arguments);
    set(this, 'records', []);
  },

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

    addRecord(record) {
      get(this, 'records').addObject(record);
    },

    removeRecord(record) {
      get(this, 'records').removeObject(record);
    },

    updateProfile() {
      get(this, 'updateProfileTask').perform()
        .then(() => this.$('.modal').modal('hide'))
        .catch(() => set(this, 'errorMessage', get(this, 'i18n').t('errors.request')));
    },

    updateImage(property, event) {
      if (event.files && event.files[0]) {
        const reader = new FileReader();
        reader.onload = evt => run(() => set(this, property, evt.target.result));
        reader.readAsDataURL(event.files[0]);
      }
    },

    goToSettings() {
      this.$('.modal').modal('hide');
      get(this, 'router').transitionTo('settings');
    }
  }
});
