import Controller from 'ember-controller';
import computed from 'ember-computed';
import service from 'ember-service/inject';
import humanizeDuration from 'client/utils/humanize-duration';
import moment from 'moment';

export default Controller.extend({
  intl: service(),

  humanizedLength: computed('model.length', function() {
    const mediaType = get(this, 'mediaType');
    const length = get(this, 'model.length');
    if (mediaType === 'anime') {
      const time = moment.duration(length, 'minutes');
      return humanizeDuration(time);
    }
    return get(this, 'intl').t('media.show.units.pages', { length });
  }).readOnly(),
});
