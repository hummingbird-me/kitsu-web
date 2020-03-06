import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { alias, filterBy, notEmpty, or } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { all, task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Controller.extend({
  notify: service(),
  settings: alias('model.taskInstance.value'),
  dirtySettings: filterBy('settings', 'hasDirtyAttributes'),
  hasDirtySettings: notEmpty('dirtySettings'),
  isValid: or('session.account.hasDirtyAttributes', 'hasDirtySettings'),

  updateSettingsTask: task(function* () {
    const settingsTasks = [];
    get(this, 'dirtySettings').forEach(setting => {
      settingsTasks.push(get(this, 'updateSettingTask').perform(setting));
    });
    yield get(this, 'session.account').save();
    yield all(settingsTasks).then(results => {
      if (isEmpty(results.filter(result => result === undefined))) {
        get(this, 'notify').success('Your notification settings were updated.');
      }
    });
  }).drop(),

  updateSettingTask: task(function* (setting) {
    return yield setting.save().catch(err => {
      get(this, 'notify').error(errorMessages(err));
      setting.rollbackAttributes();
    });
  })
});
