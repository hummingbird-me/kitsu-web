import Component from '@ember/component';
import { get, set } from '@ember/object';
import { storageFor } from 'ember-local-storage';

const ANDROID_PHONE_PATTERN = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i;
const APPLE_PHONE_PATTERN = /iPhone/i;
const CACHE_TIME_DAY = 3;

export default Component.extend({
  tagName: '',
  shouldRender: true,
  cache: storageFor('last-used'),

  init() {
    this._super(...arguments);
    const date = get(this, 'cache').get('mobile-banner');
    if (date && (new Date()) < new Date(date)) {
      set(this, 'shouldRender', false);
    }

    const isAndroidPhone = ANDROID_PHONE_PATTERN.test(navigator.userAgent);
    const isApplePhone = APPLE_PHONE_PATTERN.test(navigator.userAgent);
    set(this, 'isAndroid', isAndroidPhone);
    set(this, 'isApple', isApplePhone);
    set(this, 'isPhone', isAndroidPhone || isApplePhone);
  },

  actions: {
    dismiss() {
      const date = new Date();
      date.setTime(date.getTime() + (CACHE_TIME_DAY * 24 * 60 * 60 * 1000));
      get(this, 'cache').set('mobile-banner', date);
      set(this, 'shouldRender', false);
    }
  }
});
