import Component from 'ember-component';
import computed, { and } from 'ember-computed';
import get, { getProperties } from 'ember-metal/get';
import set, { setProperties } from 'ember-metal/set';
import service from 'ember-service/inject';
import { invokeAction } from 'ember-invoke-action';
import { task } from 'ember-concurrency';
import { image } from 'client/helpers/image';

export default Component.extend({
  classNames: ['reaction-modal'],
  editing: false,

  store: service(),

  hasInvalidReaction: and('reaction.reaction', 'reaction.validations.attrs.reaction.isInvalid'),

  remaining: computed('reaction.reaction', function() {
    return 140 - (get(this, 'reaction.reaction.length') || 0);
  }).readOnly(),

  posterImageStyle: computed('media.posterImage', function() {
    const posterImage = image(get(this, 'media.posterImage'));
    return `background-image: url("${posterImage}")`.htmlSafe();
  }).readOnly(),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'libraryEntry.mediaReaction').then((reaction) => {
      if (reaction !== null) {
        setProperties(this, { reaction, content: get(reaction, 'reaction'), editing: true });
      } else {
        const {
          media,
          libraryEntry,
          session: { account: user },
        } = getProperties(this, 'media', 'libraryEntry', 'session');
        const type = get(media, 'modelType');
        const createdReaction = get(this, 'store').createRecord('media-reaction', {
          [type]: media, user, libraryEntry
        });
        setProperties(this, { reaction: createdReaction, editing: false });
      }
    });
  },

  createReactionTask: task(function* () {
    if (get(this, 'reaction.validations.attrs.reaction.isValid') === true) {
      yield get(this, 'reaction').save();
      invokeAction(this, 'onClose');
    }
  }).drop(),
});
