import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { next } from 'ember-runloop';

export default Component.extend({
  tagName: 'section',
  classNames: ['trending-row'],
  currentTab: null,
  currentItems: null,

  getDataTask() {
    throw new Error('You must define your own `getDataTask`');
  },

  init() {
    this._super(...arguments);
    this._getData();
  },

  _getData() {
    const type = get(this, 'currentTab');
    // return if we already have results, since we don't want to reload each tab switch
    if (get(this, `${type}Results`) && get(this, `${type}Results.length`)) {
      return set(this, 'currentItems', get(this, `${type}Results`));
    }
    // request trending media for the specified type
    get(this, 'getDataTask').perform(type).then((results) => {
      set(this, `${type}Results`, results);
      set(this, 'currentItems', results);
    });
  },

  /**
   * This is a hack that we use to destroy the `ember-flickity` component as flickity
   * can't handle the internal elements changing. Because of next being 1ms this should be
   * unnoticed by the user.
   */
  _switchingTabHack() {
    set(this, 'isSwitchingTab', true);
    next(() => {
      if (get(this, 'isDestroyed') || get(this, 'isDestroying')) { return; }
      set(this, 'isSwitchingTab', false);
    });
  },

  actions: {
    changeTab(tab) {
      if (tab === get(this, 'currentTab')) { return; }
      this._switchingTabHack();
      set(this, 'currentTab', tab);
      this._getData();
    }
  }
});
