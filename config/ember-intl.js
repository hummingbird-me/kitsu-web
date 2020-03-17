/* eslint-env node */
module.exports = function() {
  return {
    disablePolyfill: true,
    publicOnly: true,
    requiresTranslation(key, locale) {
      return locale === 'en-us';
    }
  };
};
