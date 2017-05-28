import MediaIndexController, { MEDIA_QUERY_PARAMS } from 'client/controllers/media/index';
import QueryParams from 'ember-parachute';

const queryParams = new QueryParams(MEDIA_QUERY_PARAMS);

export default MediaIndexController.extend(queryParams.Mixin, {
  mediaType: 'manga',
  availableSubtypes: ['manga', 'novel', 'manhua', 'oneshot', 'doujin', 'manhwa', 'oel'],

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this.send('refresh');
    }
  }
});
