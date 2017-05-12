import MetricsService from 'ember-metrics/services/metrics';
import service from 'ember-service/inject';
import Config from 'client/config/environment';

export default MetricsService.extend({
  router: service('-routing'),

  /**
   * Support providing `staging` in the `environments` array for a metric adapter.
   */
  _filterEnvironments(adapterOption, appEnvironment) {
    let environment = appEnvironment;
    if (environment === 'production' && Config.kitsu.isStaging) {
      environment = 'staging';
    }
    return this._super(adapterOption, environment);
  }
});
