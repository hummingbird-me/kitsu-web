import MetricsService from 'ember-metrics/services/metrics';
import Config from 'client/config/environment';

export default MetricsService.extend({
  _filterEnvironments(adapterOption, appEnvironment) {
    let environment = appEnvironment;
    if (environment === 'production' && Config.isStaging) {
      environment = 'staging';
    }
    let { environments } = adapterOption;
    environments = environments || ['all'];
    const wrappedEnvironments = [environments];
    return wrappedEnvironments.indexOf('all') > -1 || wrappedEnvironments.indexOf(environment) > -1;
  }
});
