import Component, { REMOVE_KEY } from 'client/components/library-dropdown/component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';
import { assert } from 'ember-metal/utils';
import { task } from 'ember-concurrency';
import layout from 'client/components/library-dropdown/template';

export default Component.extend({
  layout,
  session: service(),
  store: service(),

  requestEntry: task(function* () {
    const media = get(this, 'media');
    const entry = yield get(this, 'store').query('library-entry', {
      filter: {
        user_id: get(this, 'session.account.id'),
        media_type: capitalize(media.constructor.modelName),
        media_id: get(media, 'id')
      }
    }).then(e => get(e, 'firstObject'));
    set(this, 'entry', entry);
  }).cancelOn('willDestroyElement').drop(),

  updateTask: task(function* (status) {
    const entry = get(this, 'entry');
    if (entry === undefined) {
      yield get(this, 'store').createRecord('library-entry', {
        status: status.key,
        user: get(this, 'session.account'),
        media: get(this, 'media')
      }).save().then(newEntry => set(this, 'entry', newEntry));
    } else if (status.key === REMOVE_KEY) {
      yield get(this, 'entry').destroyRecord()
        .then(() => set(this, 'entry', undefined))
        .catch(() => entry.rollbackAttributes());
    } else {
      set(entry, 'status', status.key);
      yield entry.save().catch(() => entry.rollbackAttributes());
    }
  }).drop(),

  init() {
    this._super(...arguments);
    assert('Must pass a `media` attribute to `{{library-dropdown/media}}`',
      get(this, 'media') !== undefined);
    assert('Do not pass a `entry` attribute to `{{library-dropdown/media}}`',
      get(this, 'entry') === undefined);
    get(this, 'requestEntry').perform();
  }
});
