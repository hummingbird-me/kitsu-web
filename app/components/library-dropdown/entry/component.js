import Component, { REMOVE_KEY } from 'client/components/library-dropdown/component';
import get from 'ember-metal/get';
import { assert } from 'ember-metal/utils';
import { task } from 'ember-concurrency';
import layout from 'client/components/library-dropdown/template';
import Ember from 'ember';

const { K } = Ember;

export default Component.extend({
  layout,
  create: K,
  update: K,
  delete: K,

  updateTask: task(function* (status) {
    const entry = get(this, 'entry');
    if (entry === undefined) {
      yield get(this, 'create')(status.key);
    } else if (status.key === REMOVE_KEY) {
      yield get(this, 'delete')();
    } else {
      yield get(this, 'update')(status.key);
    }
  }).drop(),

  init() {
    this._super(...arguments);
    assert('Must pass a `entry` attribute to `{{library-dropdown/existing}}`',
      get(this, 'entry') !== undefined);
    assert('Must pass a `media` attribute to `{{library-dropdown/existing}}`',
      get(this, 'media') !== undefined);
  }
});
