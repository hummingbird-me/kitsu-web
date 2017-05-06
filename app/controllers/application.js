import Controller from 'ember-controller';
import Config from 'client/config/environment';

export default Controller.extend({
  queryParams: ['notification'],
  notification: null,
  isStaging: Config.kitsu.isStaging
});
