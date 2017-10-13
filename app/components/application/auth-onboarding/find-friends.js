import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { invokeAction } from 'ember-invoke-action';
import { task, taskGroup } from 'ember-concurrency';

// TODO: i18n errors
export default Component.extend({
  facebook: service(),
  notify: service(),
  tasks: taskGroup().drop(),

  connectFacebook: task(function* () {
    yield get(this, 'facebook').connect(get(this, 'session.account'))
      .catch(() => get(this, 'notify').error('There is already an account on Kitsu with your Facebook account connected.'));
  }).group('tasks'),

  disconnectFacebook: task(function* () {
    yield get(this, 'facebook').disconnect(get(this, 'session.account'))
      .catch(() => get(this, 'notify').error('There was an issue disconnecting your Facebook account.'));
  }).group('tasks'),

  importFriends: task(function* () {
    if (isPresent(get(this, 'session.account.facebookId')) === true) {
      yield get(this, 'facebook').importFriends().catch(() => {});
    }
  }).group('tasks'),

  actions: {
    close() {
      invokeAction(this, 'close');
    }
  }
});
