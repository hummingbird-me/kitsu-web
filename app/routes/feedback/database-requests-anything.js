import FeatureRoute from 'client/routes/feedback/feature-requests';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

export default FeatureRoute.extend({
  templateName: 'feedback/database-requests',
  intl: service(),

  titleToken() {
    return get(this, 'intl').t('titles.feedback.database-requests');
  }
});
