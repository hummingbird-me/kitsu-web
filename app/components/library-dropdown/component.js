import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed, { or } from 'ember-computed';
import service from 'ember-service/inject';
import libraryStatus from 'client/utils/library-status';

export const REMOVE_KEY = 'library.remove';

export default Component.extend({
  i18n: service(),
  isWaiting: or('requestEntry.isRunning', 'updateTask.isRunning'),

  currentStatus: computed('entry.status', {
    get() {
      const status = get(this, 'entry.status');
      const type = get(this, 'mediaType');
      return get(this, 'i18n').t(`library.statuses.${type}.${status}`).toString();
    }
  }).readOnly(),

  statuses: computed('entry', 'currentStatus', {
    get() {
      const type = get(this, 'mediaType');
      const statuses = libraryStatus.getEnumKeys().map(key => ({
        key,
        string: get(this, 'i18n').t(`library.statuses.${type}.${key}`).toString()
      }));
      if (get(this, 'entry') === undefined) {
        return statuses;
      }
      const status = get(this, 'currentStatus');
      statuses.splice(statuses.findIndex(el => el.string === status), 1);
      const removeKey = get(this, 'i18n').t(REMOVE_KEY).toString();
      return statuses.concat([{ key: REMOVE_KEY, string: removeKey }]);
    }
  }).readOnly(),

  init() {
    this._super(...arguments);
    const media = get(this, 'media');
    const type = media.constructor.modelName || get(media, 'content').constructor.modelName;
    set(this, 'mediaType', type);
  }
});
