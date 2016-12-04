import Controller from 'ember-controller';
import service from 'ember-service/inject';
import Config from 'client/config/environment';
import getter from 'client/utils/getter';

export default Controller.extend({
  session: service(),
  isStaging: getter(() => Config.isStaging),
});
