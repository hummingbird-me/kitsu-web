import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { CanMixin } from 'ember-can';

export default Route.extend(CanMixin, {
  queryParams: {
    filter: { replace: true },
    query: { replace: true }
  },
  intl: service(),

  beforeModel() {
    const model = this.modelFor('groups.group.dashboard');
    const membership = get(model, 'membership');
    if (!this.can('manage tickets for group', { membership })) {
      return this.transitionTo('groups.group.dashboard.index');
    }
  },

  model() {
    return this.modelFor('groups.group.dashboard');
  },

  titleToken(model) {
    const group = get(model, 'group.name');
    return get(this, 'intl').t('titles.groups.group.dashboard.tickets', { group });
  }
});
