import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import humanizeDuration from 'client/utils/humanize-duration';
import moment from 'moment';

export default Component.extend({
  classNames: ['about-me-panel'],
  intl: service(),

  gender: computed('user.gender', function() {
    const gender = get(this, 'user.gender') || 'secret';
    if (['secret', 'male', 'female'].includes(gender)) {
      return get(this, 'intl').t(`users.activity.about.gender.${gender}`);
    }
    return gender;
  }),

  createdHumanize: computed('user.createdAt', function() {
    return humanizeDuration(moment.duration(moment().diff(this.get('user.createdAt'))), true);
  })
});
