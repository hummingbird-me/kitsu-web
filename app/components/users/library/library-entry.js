import Component from 'ember-component';
import computed, { alias } from 'ember-computed';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task, timeout } from 'ember-concurrency';
import jQuery from 'jquery';
import { invokeAction } from 'ember-invoke-action';
import { modelType } from 'client/helpers/model-type';
import { decimalNumber } from 'client/helpers/decimal-number';

export default Component.extend({
  isExpanded: false,
  session: service(),
  i18n: service(),
  metrics: service(),
  media: alias('entry.media'),
  user: alias('entry.user'),

  totalProgressText: computed('media.unitCount', {
    get() {
      return get(this, 'media.unitCount') || '-';
    }
  }).readOnly(),

  ratingText: computed('entry.rating', {
    get() {
      const rating = get(this, 'entry.rating');
      return rating ? decimalNumber([rating]) : '-';
    }
  }).readOnly(),

  typeText: computed('media.subtype', {
    get() {
      const media = modelType([get(this, 'media')]);
      const type = get(this, 'media.subtype');
      return get(this, 'i18n').t(`media.${media}.type.${type}`);
    }
  }).readOnly(),

  saveEntry: task(function* () {
    yield invokeAction(this, 'save', get(this, 'entry'));
  }).restartable(),

  saveEntryDebounced: task(function* () {
    yield timeout(1500);
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
      invokeAction(this, 'delete', get(this, 'entry'));
    }
  }
});
