import MobileRoute from 'client/routes/feedback/mobile-bugs';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default MobileRoute.extend({
  templateName: 'feedback/mobile-bugs',
  intl: service(),

  titleToken() {
    return get(this, 'intl').t('titles.feedback.mobile-bugs');
  }
});
