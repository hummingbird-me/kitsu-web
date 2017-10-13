import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import moment from 'moment';

export default Component.extend({
  ajax: service(),
  intl: service(),
  notify: service(),

  revokeInviteTask: task(function* () {
    const id = get(this, 'invite.id');
    const URL = `group-invites/${id}/_revoke`;
    yield get(this, 'ajax').post(URL).then(() => {
      get(this, 'invite').set('revokedAt', moment.utc());
    }).catch(() => {
      get(this, 'notify').error(get(this, 'intl').t('errors.request'));
    });
  }).drop()
});
