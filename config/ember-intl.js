/* eslint-env node */
module.exports = function() {
  return {
    publicOnly: true,
    requiresTranslation(key, locale) {
      return locale === 'en-us';
    }
  };
};
