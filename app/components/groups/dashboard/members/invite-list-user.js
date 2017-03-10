import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  ajax: service(),
  intl: service(),
  notify: service(),

  revokeInviteTask: task(function* () {
    if (get(this, 'isRevoked')) { return; }
    const id = get(this, 'invite.id');
    const URL = `group-invites/${id}/_revoke`;
    yield get(this, 'ajax').post(URL).then(() => {
      set(this, 'isRevoked', true);
    }).catch(() => {
      get(this, 'notify').error(get(this, 'intl').t('errors.request'));
    });
  }).drop()
});
