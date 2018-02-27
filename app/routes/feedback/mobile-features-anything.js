import MobileRoute from 'client/routes/feedback/mobile-features';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default MobileRoute.extend({
  templateName: 'feedback/mobile-features',
  intl: service(),

  titleToken() {
    return get(this, 'intl').t('titles.feedback.mobile-features');
  }
});
