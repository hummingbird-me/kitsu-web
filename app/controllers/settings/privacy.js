import Controller from 'ember-controller';
import get from 'ember-metal/get';
import { alias } from 'ember-computed';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Controller.extend({
  notify: service(),
  session: service(),
  user: alias('session.account'),

  updateProfile: task(function* () {
    yield get(this, 'user').save()
      .then(() => get(this, 'notify').success('Your profile was updated.'))
      .catch((err) => {
        get(this, 'notify').error(errorMessages(err));
        get(this, 'user').rollbackAttributes();
      });
  }).drop()
});
