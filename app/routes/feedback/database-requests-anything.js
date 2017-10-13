import FeatureRoute from 'client/routes/feedback/feature-requests';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default FeatureRoute.extend({
  templateName: 'feedback/database-requests',
  intl: service(),

  titleToken() {
    return get(this, 'intl').t('titles.feedback.database-requests');
  }
});
