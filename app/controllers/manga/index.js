import MediaIndexController, { MEDIA_QUERY_PARAMS } from 'client/controllers/media/index';
import QueryParams from 'ember-parachute';
import { isEmpty } from '@ember/utils';
import { serializeArray, deserializeArray } from 'client/utils/queryable';
import { moment } from 'client/utils/moment';
import { minYearManga } from 'client/utils/media-minyear';

const queryParams = new QueryParams(MEDIA_QUERY_PARAMS, {
  year: {
    defaultValue: [minYearManga, moment().year() + 2],
    refresh: true,
    serialize(value) {
      const [lower, upper] = value;
      if (lower === minYearManga && upper === (moment().year() + 2)) {
        return undefined;
      } if (upper === (moment().year() + 2)) {
        return serializeArray([lower, null]);
      }
      return serializeArray(value);
    },
    deserialize(value = []) {
      const [lower, upper] = deserializeArray(value);
      if (isEmpty(upper)) {
        return [lower, moment().year() + 2];
      }
      return [lower, upper];
    }
  }
});

export default MediaIndexController.extend(queryParams.Mixin, {
  mediaType: 'manga',
  availableSubtypes: ['manga', 'novel', 'manhua', 'oneshot', 'doujin', 'manhwa', 'oel'],

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this.send('refresh');
    }
  }
});
