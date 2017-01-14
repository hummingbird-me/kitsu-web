import Controller from 'ember-controller';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import computed, { alias } from 'ember-computed';
import moment from 'moment';
/* global humanizeDuration */

export default Controller.extend({
  session: service(),
  entry: alias('parent.entry'),
  media: alias('parent.media'),

  airedLongerThanOneDay: computed('media.startDate', 'media.endDate', {
    get() {
      return !get(this, 'media.startDate').isSame(get(this, 'media.endDate'));
    }
  }).readOnly(),

  totalTime: computed('media.episodeLength', {
    get() {
      const time = moment.duration(get(this, 'media.episodeCount') * get(this, 'media.episodeLength'), 'minutes');
      return humanizeDuration(time.asMilliseconds(), { largest: 1 });
    }
  }).readOnly(),
});
