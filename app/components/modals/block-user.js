import Component from '@ember/component';
import { get } from '@ember/object';
import { assert } from '@ember/debug';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  notify: service(),
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
