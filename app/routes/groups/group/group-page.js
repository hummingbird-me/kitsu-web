import Route from 'ember-route';
import CoverPageMixin from 'client/mixins/routes/cover-page';

export default Route.extend(CoverPageMixin, {
  model() {
    return this.modelFor('groups.group');
  }
});
