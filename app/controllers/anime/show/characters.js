import MediaShowController from 'client/controllers/media/show/characters';
import QueryParams from 'ember-parachute';

const queryParams = new QueryParams({
  language: {
    defaultValue: 'japanese',
    refresh: true
  }
});

export default MediaShowController.extend(queryParams.Mixin, {
  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this.send('refreshModel');
    }
  }
});
