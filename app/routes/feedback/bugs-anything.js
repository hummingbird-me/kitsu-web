import BugsRoute from 'client/routes/feedback/bugs';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

export default BugsRoute.extend({
  templateName: 'feedback/bugs',
  intl: service(),

  titleToken() {
    return get(this, 'intl').t('titles.feedback.bugs');
  }
});
