const VAR_REGEX = /var\((--[a-z0-9-]+)\)/;

/**
 * Custom PostCSS plugin to resolve custom properties within the same scope, so that color-mod can
 * be preprocessed without issues.
 */
module.exports = (opts = {}) => {
  return {
    postcssPlugin: 'resolveLocalCustomProperties',

    Once(root) {
      root.walkDecls((decl) => {
        let customProperties = {};
        if (decl.value.match(VAR_REGEX)) {
          // Load the custom properties in the parent
          decl.parent.walkDecls((decl) => {
            if (!decl.variable) return;
            customProperties[decl.prop] = decl.value;
          });

          const transformedValue = decl.value.replace(
            VAR_REGEX,
            (match, variable) => {
              return customProperties[variable] ?? match;
            }
          );
          decl.assign({ value: transformedValue });
        }
      });
    },
  };
};
module.exports.postcss = true;
