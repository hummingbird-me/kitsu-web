import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  intl: service(),
  notify: service(),

  unbanUserTask: task(function* () {
    yield get(this, 'ban').destroyRecord().catch(() => {
      get(this, 'notify').error(get(this, 'intl').t('errors.request'));
    });
  }).drop()
});
