import Component from 'ember-component';
import computed, { alias, not, or } from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { htmlSafe } from 'ember-string';
import { isEmpty } from 'ember-utils';
import { invokeAction } from 'ember-invoke-action';
import { task } from 'ember-concurrency';
import createChangeset from 'ember-changeset-cp-validations';
import { image } from 'client/helpers/image';

export default Component.extend({
  classNames: ['reaction-modal'],
  placeholderIndex: 0,
  store: service(),
  reaction: alias('loadReactionTask.last.value'),
  isEditing: not('loadReactionTask.last.value.isNew'),
  isWorking: or('createReactionTask.isRunning', 'deleteReactionTask.isRunning'),

  canPost: computed('isWorking', 'changeset.isInvalid', 'changeset.reaction', function() {
    const isWorking = get(this, 'isWorking');
    const isInvalid = get(this, 'changeset.isInvalid');
    const hasReaction = !isEmpty(get(this, 'changeset.reaction'));
    return !isWorking && !isInvalid && hasReaction;
  }).readOnly(),

  remaining: computed('changeset.reaction', function() {
    return 140 - (get(this, 'changeset.reaction.length') || 0);
  }).readOnly(),

  posterImageStyle: computed('media.posterImage', function() {
    const posterImage = image(get(this, 'media.posterImage'), 'medium');
    return htmlSafe(`background-image: url("${posterImage}")`);
  }).readOnly(),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'loadReactionTask').perform();
    set(this, 'placeholderIndex', this._getRandomInt(0, 4));
  },

  loadReactionTask: task(function* () {
    const libraryEntry = get(this, 'libraryEntry');
    let reaction = null;
    if (!get(this, 'createOnly')) {
      reaction = yield libraryEntry.belongsTo('mediaReaction').load();
    }
    if (!reaction) {
      const media = get(this, 'media');
      const type = get(media, 'modelType');
      reaction = get(this, 'store').createRecord('media-reaction', {
        [type]: media,
        user: get(this, 'session.account'),
        libraryEntry
      });
    }
    set(this, 'changeset', createChangeset(reaction));
    return reaction;
  }).drop(),

  createReactionTask: task(function* () {
    const changeset = get(this, 'changeset');
    yield changeset.validate();
    if (get(changeset, 'isValid') && get(changeset, 'isDirty')) {
      yield changeset.save();
      invokeAction(this, 'onCreate', get(this, 'reaction'));
      if (!get(this, 'doNotClose')) {
        invokeAction(this, 'onClose');
      }
    }
  }).drop(),

  deleteReactionTask: task(function* () {
    const libraryEntry = get(this, 'libraryEntry');
    const reaction = yield libraryEntry.belongsTo('mediaReaction').load();
    yield reaction.destroyRecord();
    invokeAction(this, 'onClose');
  }).drop(),

  _getRandomInt(min, max) {
    const _min = Math.ceil(min);
    const _max = Math.floor(max);
    return Math.floor(Math.random() * (_max - _min)) + _min;
  }
});
