import MetricsService from 'ember-metrics/services/metrics';
import Config from 'client/config/environment';

export default MetricsService.extend({
  /**
   * Support providing `staging` in the `environments` array for a metric adapter.
   */
  _filterEnvironments(adapterOption, appEnvironment) {
    let environment = appEnvironment;
    if (environment === 'production' && Config.APP.isStaging) {
      environment = 'staging';
    }
    return this._super(adapterOption, environment);
  }
});
