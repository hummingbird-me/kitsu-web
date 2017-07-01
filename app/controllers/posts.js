import Controller from 'ember-controller';
import QueryParams from 'ember-parachute';

const queryParams = new QueryParams({
  sort: { defaultValue: 'recent' }
});

export default Controller.extend(queryParams.Mixin, {
  sortOptions: ['likes', 'replies', 'recent']
});
