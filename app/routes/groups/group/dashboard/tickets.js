import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { CanMixin } from 'ember-can';

export default Route.extend(CanMixin, {
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
