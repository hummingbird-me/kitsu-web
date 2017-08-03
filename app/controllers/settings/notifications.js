import Controller from 'ember-controller';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import { alias, filterBy, notEmpty } from 'ember-computed';
import { isEmpty } from 'ember-utils';
import { all, task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Controller.extend({
  notify: service(),
  settings: alias('model.taskInstance.value'),
  dirtySettings: filterBy('settings', 'hasDirtyAttributes'),
  isValid: notEmpty('dirtySettings'),

  updateSettingsTask: task(function* () {
    const settingsTasks = [];
    get(this, 'dirtySettings').forEach((setting) => {
      settingsTasks.push(get(this, 'updateSettingTask').perform(setting));
    });
    yield all(settingsTasks).then((results) => {
      if (isEmpty(results.filter(result => result === undefined))) {
        get(this, 'notify').success('Your notification settings were updated.');
      }
    });
  }).drop(),

  updateSettingTask: task(function* updateNotificationSetting(setting) {
    return yield setting.save().catch((err) => {
      get(this, 'notify').error(errorMessages(err));
      setting.rollbackAttributes();
    });
  })
});
