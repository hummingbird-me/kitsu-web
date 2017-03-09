import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { CanMixin } from 'ember-can';
import RSVP from 'rsvp';

export default Route.extend(CanMixin, {
  intl: service(),

  beforeModel() {
    const model = this.modelFor('groups.group.dashboard');
    const membership = get(model, 'membership');
    if (!this.can('manage settings for group', { membership })) {
      return this.transitionTo('groups.group.dashboard.index');
    }
  },

  model() {
    const model = this.modelFor('groups.group.dashboard');
    return RSVP.hash({
      group: get(model, 'group'),
      category: get(model, 'group').belongsTo('category').load(),
      categories: get(this, 'store').findAll('group-category')
    });
  },

  setupController(controller, model) {
    this._super(...arguments);
    get(controller, 'records').addObject(get(model, 'group'));

    const options = get(model, 'group.isClosed') ? ['closed'] : ['open', 'closed', 'restricted'];
    set(controller, 'privacyOptions', options);

    const category = get(model, 'category');
    set(controller, 'selectedCategory', {
      id: get(category, 'id'),
      name: get(category, 'name'),
      slug: get(category, 'slug')
    });
  },

  titleToken(model) {
    const group = get(model, 'group.name');
    return get(this, 'intl').t('titles.groups.group.dashboard.settings', { group });
  }
});
