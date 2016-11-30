import Controller from 'ember-controller';
import Config from 'client/config/environment';
import getter from 'client/utils/getter';

export default Controller.extend({
  isStaging: getter(() => Config.isStaging)
});
