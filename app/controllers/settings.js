import Controller from 'ember-controller';
import service from 'ember-service/inject';
import { alias } from 'ember-computed';
import { task } from 'ember-concurrency';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Controller.extend({
  importModal: false,

  session: service(),
  user: alias('session.account'),
  imports: alias('model'),

  updateTask: task(function* () {
    return yield get(this, 'user').save()
      .then(() => set(this, 'user.password', undefined));
  })
});
