import Component from 'ember-component';
import computed, { alias } from 'ember-computed';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task, timeout } from 'ember-concurrency';
import IsOwnerMixin from 'client/mixins/is-owner';
import jQuery from 'jquery';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend(IsOwnerMixin, {
  isExpanded: false,
  session: service(),
  i18n: service(),
  metrics: service(),
  media: alias('entry.media'),
  user: alias('entry.user'),

  totalProgressText: computed('media.episodeCount', {
    get() {
      return get(this, 'media.episodeCount') || '-';
    }
  }).readOnly(),

  ratingText: computed('entry.rating', {
    get() {
      return get(this, 'entry.rating') || '-';
    }
  }).readOnly(),

  typeText: computed('media.{showType,mangaType}', {
    get() {
      const mediaType = get(this, 'mediaType');
      const type = get(this, 'media.showType') || get(this, 'media.mangaType');
      return get(this, 'i18n').t(`media.${mediaType}.type.${type}`);
    }
  }).readOnly(),

  saveEntry: task(function* () {
    yield invokeAction(this, 'save');
  }).restartable(),

  saveEntryDebounced: task(function* () {
    yield timeout(1000);
    yield get(this, 'saveEntry').perform();
  }).restartable(),

  /**
   * Toggle the `isExpanded` property when the component is clicked.
   * Returns early if the click is not within the desired container or
   * is within an input element.
   */
  click(event) {
    const target = get(event, 'target');
    const isChild = jQuery(target).is('.entry-wrapper *, .entry-wrapper');
    if (isChild === false || get(target, 'tagName') === 'INPUT') {
      return;
    }
    this.toggleProperty('isExpanded');
  },

  actions: {
    sanitizeNumber(value) {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? value : parsed;
    },

    delete() {
      invokeAction(this, 'delete');
    }
  }
});
