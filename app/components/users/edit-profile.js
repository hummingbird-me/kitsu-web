import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import computed, { equal, filterBy } from 'ember-computed';
import service from 'ember-service/inject';
import { image } from 'client/helpers/image';
import { task } from 'ember-concurrency';
import run from 'ember-runloop';
import { invokeAction } from 'ember-invoke-action';
import RSVP from 'rsvp';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  errorMessage: undefined,

  notify: service(),
  router: service('-routing'),

  _component: 'about-me',
  componentName: computed('_component', {
    get() {
      return `users/edit-profile/${get(this, '_component')}`;
    }
  }).readOnly(),

  coverImageStyle: computed('user.coverImage', {
    get() {
      const coverImage = image(get(this, 'user.coverImage'));
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
      get(this, 'records').filterBy('hasDirtyAttributes').forEach((record) => {
        if (get(record, 'isNew') === false) {
          record.rollbackAttributes();
        }
      });
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
        .catch(err => set(this, 'errorMessage', errorMessages(err)));
    },

    updateImage(property, event) {
      if (event.files && event.files[0]) {
        const reader = new FileReader();
        reader.onload = evt => run(() => set(this, property, evt.target.result));
        reader.onerror = err => get(this, 'notify').error(errorMessages(err));
        reader.readAsDataURL(event.files[0]);
      }
    },

    transitionToSettings() {
      this.$('.modal').on('hidden.bs.modal', () => {
        get(this, 'router').transitionTo('settings');
      }).modal('hide');
    }
  }
});
