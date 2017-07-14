import Controller from 'ember-controller';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import humanizeDuration from 'client/utils/humanize-duration';
import moment from 'moment';

export default Controller.extend({
  intl: service(),

  humanizedLength: computed('model.length', function() {
    const unitType = get(this, 'model.modelType');
    const length = get(this, 'model.length');
    if (unitType === 'episode') {
      const time = moment.duration(length, 'minutes');
      return humanizeDuration(time);
    }
    return get(this, 'intl').t('media.show.units.pages', { length });
  }).readOnly(),
});
