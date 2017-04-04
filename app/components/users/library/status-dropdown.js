import Component from 'ember-component';
import get from 'ember-metal/get';
import computed, { reads } from 'ember-computed';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import libraryStatus from 'client/utils/library-status';

const REMOVE_KEY = 'library-shared.remove';

export default Component.extend({
  classNameBindings: ['entry:has-entry'],
  intl: service(),
  mediaType: reads('entry.media.modelType'),

  status: computed('entry.status', function() {
    const status = get(this, 'entry.status');
    const type = get(this, 'mediaType');
    return get(this, 'intl').t(`library-shared.${status}`, { type }).toString();
  }).readOnly(),

  statuses: computed('status', function() {
    const type = get(this, 'mediaType');
    const statuses = libraryStatus.getEnumKeys().map(key => ({
      key,
      string: get(this, 'intl').t(`library-shared.${key}`, { type }).toString()
    }));
    const removeKey = get(this, 'intl').t(REMOVE_KEY).toString();
    return statuses.concat([{ key: REMOVE_KEY, string: removeKey }]);
  }).readOnly(),

  updateTask: task(function* (status) {
    const entry = get(this, 'entry');
    if (get(entry, 'status') === status.key) { return; }
    const actions = get(this, 'methods');
    if (status.key === REMOVE_KEY) {
      yield invokeAction(actions, 'delete');
    } else {
      yield invokeAction(actions, 'update', status.key);
    }
  }).drop(),
});
