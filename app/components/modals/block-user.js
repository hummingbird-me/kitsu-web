import Component from 'ember-component';
import get from 'ember-metal/get';
import { assert } from 'ember-metal/utils';
import service from 'ember-service/inject';
import { isPresent } from 'ember-utils';
import { task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  notify: service(),
  session: service(),
  store: service(),

  blockUser: task(function* () {
    const block = get(this, 'store').createRecord('block', {
      user: get(this, 'session.account'),
      blocked: get(this, 'user')
    });

    yield block.save().then(() => {
      this.$('.modal').modal('hide');
      get(this, 'notify').info(`You have blocked ${get(this, 'user.name')}`);
    }).catch(err => (
      get(this, 'notify').error(errorMessages(err))
    ));
  }).drop(),

  init() {
    this._super(...arguments);
    assert('You must pass a user into the `block-user` component.', isPresent(get(this, 'user')));
  }
});
