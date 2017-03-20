import Component from 'ember-component';
import get from 'ember-metal/get';
import computed, { not } from 'ember-computed';
import humanizeDuration from 'client/utils/humanize-duration';
import moment from 'moment';

const computedProduction = key => (
  computed('media.animeProductions', function() {
    const productions = get(this, 'media.animeProductions');
    return productions.filterBy('role', key).mapBy('producer.name').join(', ');
  }).readOnly()
);

export default Component.extend({
  tagName: 'section',
  classNames: ['media--information'],
  producers: computedProduction('producer'),
  licensors: computedProduction('licensor'),
  studios: computedProduction('studio'),

  isAnime: computed('media', function() {
    return get(this, 'media.modelType') === 'anime';
  }).readOnly(),
  isManga: not('isAnime').readOnly(),

  airedLongerThanOneDay: computed('media.{startDate,endDate}', function() {
    const start = get(this, 'media.startDate');
    if (!start) { return false; }
    return !start.isSame(get(this, 'media.endDate'));
  }).readOnly(),

  totalTime: computed('media.{episodeCount,episodeLength}', function() {
    const count = get(this, 'media.episodeCount');
    const length = get(this, 'media.episodeLength');
    const time = moment.duration(count * length, 'minutes');
    return humanizeDuration(time);
  }).readOnly()
});
