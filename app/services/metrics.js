import MetricsService from 'ember-metrics/services/metrics';
import Config from 'client/config/environment';

export default MetricsService.extend({
  _filterEnvironments(adapterOption, appEnvironment) {
    let environment = appEnvironment;
    if (environment === 'production' && Config.isStaging) {
      environment = 'staging';
    }
    return this._super(adapterOption, environment);
  }
});
