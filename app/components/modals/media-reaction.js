import Component from 'ember-component';
import computed, { and } from 'ember-computed';
import get, { getProperties } from 'ember-metal/get';
import set, { setProperties } from 'ember-metal/set';
import service from 'ember-service/inject';
import { invokeAction } from 'ember-invoke-action';
import { task } from 'ember-concurrency';
import createChangeset from 'ember-changeset-cp-validations';
import { image } from 'client/helpers/image';

export default Component.extend({
  classNames: ['reaction-modal'],
  editing: false,

  store: service(),

  remaining: computed('changeset.reaction', function() {
    return 140 - (get(this, 'changeset.reaction.length') || 0);
  }).readOnly(),

  posterImageStyle: computed('media.posterImage', function() {
    const posterImage = image(get(this, 'media.posterImage'));
    return `background-image: url("${posterImage}")`.htmlSafe();
  }).readOnly(),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'loadReactionTask').perform();
  },

  loadReactionTask: task(function* () {
    const libraryEntry = get(this, 'libraryEntry');
    let reaction = yield libraryEntry.belongsTo('mediaReaction').load();
    if (!reaction) {
      const { media, session: { account: user } } =
        getProperties(this, 'media', 'session');
      const type = get(media, 'modelType');
      reaction = get(this, 'store').createRecord('media-reaction', {
        [type]: media, user, libraryEntry
      });
    } else {
      set(this, 'editing', true);
    }
    set(this, 'changeset', createChangeset(reaction));
  }).keepLatest(),

  createReactionTask: task(function* () {
    const changeset = get(this, 'changeset');
    yield changeset.validate();
    if (get(changeset, 'isValid') && get(changeset, 'isDirty')) {
      yield changeset.save();
      invokeAction(this, 'onClose');
    }
  }).drop(),

  deleteReactionTask: task(function* () {
    const libraryEntry = get(this, 'libraryEntry');
    const reaction = yield libraryEntry.belongsTo('mediaReaction').load();
    yield reaction.destroyRecord();
    invokeAction(this, 'onClose');
  }).drop()
});
