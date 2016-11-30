import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { isEmpty } from 'ember-utils';
import { task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  explanation: undefined,
  reason: undefined,

  notify: service(),
  session: service(),
  store: service(),

  createReport: task(function* () {
    if (isEmpty(get(this, 'explanation')) === true || isEmpty(get(this, 'reason')) === true) {
      return;
    }

    const report = get(this, 'store').createRecord('report', {
      explanation: get(this, 'explanation'),
      reason: get(this, 'reason').toLowerCase(),
      status: 'reported',
      user: get(this, 'session.account'),
      naughty: get(this, 'content')
    });
    return yield report.save()
      .then(() => this.$('.modal').modal('hide'))
      .catch(err => get(this, 'notify').error(errorMessages(err)));
  }).drop(),

  init() {
    this._super(...arguments);
    set(this, 'reasons', ['NSFW', 'Offensive', 'Spoiler', 'Bullying', 'Other']);
  }
});
