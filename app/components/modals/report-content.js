import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { capitalize } from '@ember/string';
import { task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  hasReported: false,
  explanation: undefined,
  reason: undefined,
  notify: service(),
  store: service(),
  isExplanationRequired: equal('reason', 'Other').readOnly(),

  explanationPlaceholder: computed('isExplanationRequired', function() {
    const base = 'What\'s wrong with this content?';
    return get(this, 'isExplanationRequired') ? `${base} (Required)` : `${base} (Optional)`;
  }).readOnly(),

  canSubmit: computed('isExplanationRequired', 'reason', 'explanation', function() {
    let canSubmit = !isEmpty(get(this, 'reason')) && !get(this, 'hasReported');
    if (get(this, 'isExplanationRequired')) {
      canSubmit = canSubmit && !isEmpty(get(this, 'explanation'));
    }
    return canSubmit;
  }).readOnly(),

  createReport: task(function* () {
    if (!get(this, 'canSubmit')) {
      return;
    }

    const type = get(this, 'group.content') ? 'group-report' : 'report';
    const report = get(this, 'store').createRecord(type, {
      explanation: get(this, 'explanation'),
      reason: get(this, 'reason').toLowerCase(),
      status: 'reported',
      user: get(this, 'session.account'),
      naughty: get(this, 'content')
    });
    if (get(this, 'group.content')) {
      set(report, 'group', get(this, 'group'));
    }
    return yield report.save().then(() => {
      get(this, 'notify').success('Your report has been sent. Thank you!');
      this.$('.modal').modal('hide');
    }).catch(err => get(this, 'notify').error(errorMessages(err)));
  }).drop(),

  checkReport: task(function* () {
    const type = get(this, 'group.content') ? 'group-report' : 'report';
    return yield get(this, 'store').query(type, {
      filter: {
        user_id: get(this, 'session.account.id'),
        naughty_id: get(this, 'content.id'),
        naughty_type: capitalize(get(this, 'content.modelType'))
      }
    });
  }).drop(),

  init() {
    this._super(...arguments);
    // https://github.com/hummingbird-me/kitsu-server/blob/c8b6eb31f6ee3c5414652c7083a9e48703bb5771/app/models/report.rb#L37
    set(this, 'reasons', ['NSFW', 'Offensive', 'Spoiler', 'Bullying', 'Spam', 'Other']);
    get(this, 'checkReport').perform().then(report => {
      if (isEmpty(report) === false) {
        set(this, 'hasReported', true);
        set(this, 'report', get(report, 'firstObject'));
      }
    }).catch(() => {});
  }
});
