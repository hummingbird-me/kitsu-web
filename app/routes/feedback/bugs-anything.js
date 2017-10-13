import BugsRoute from 'client/routes/feedback/bugs';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default BugsRoute.extend({
  templateName: 'feedback/bugs',
  intl: service(),

  titleToken() {
    return get(this, 'intl').t('titles.feedback.bugs');
  }
});
