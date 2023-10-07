// @ts-check
const stylelint = require('stylelint');
const fs = require('fs');
const postcss = require('postcss');

const andify = (arr) => {
  if (arr.length === 0) {
    return '';
  } else if (arr.length === 1) {
    return arr[0];
  } else if (arr.length === 2) {
    return arr.join(' and ');
  } else {
    return `${arr.slice(0, -1).join(', ')}, and ${arr.slice(-1)}`;
  }
};

const ruleName = 'kitsu-io/validate-theme-variables';
const messages = stylelint.utils.ruleMessages(ruleName, {
  missing: (property, missing) =>
    `Variable ${property} is missing from ${andify(missing)}.`,
});
const meta = {
  url: 'https://github.com/hummingbird-me/kitsu-web/blob/the-future/postcss/README.md',
};

/** @type {import('stylelint').Rule} */
const ruleFunction = (primaryOption, secondaryOptionObject) => {
  /** @type {string[]} */
  const files = secondaryOptionObject?.files ?? [];

  const fileVariables = {};
  for (const file of files) {
    const set = (fileVariables[file] = new Set());
    postcss()
      .process(fs.readFileSync(file, 'utf8'))
      .root.walkDecls(/^--/, (decl) => set.add(decl.prop), {});
  }

  return (postcssRoot, postcssResult) => {
    const validOptions = stylelint.utils.validateOptions(
      postcssResult,
      ruleName,
      {
        actual: primaryOption,
        possible: [true, false, 'warning', 'error'],
      },
      {
        actual: secondaryOptionObject,
        possible: {
          files: (value) => typeof value === 'string',
        },
      },
    );

    if (!validOptions) return;
    if (!primaryOption) return;

    postcssRoot.walkDecls(/^--/, (decl) => {
      const missing = Object.keys(fileVariables).filter(
        (file) => !fileVariables[file].has(decl.prop),
      );

      if (missing.length > 0) {
        stylelint.utils.report({
          ruleName,
          node: decl,
          endIndex: decl.prop.length,
          result: postcssResult,
          message: messages.missing(decl.prop, missing),
          severity: primaryOption === 'warning' ? 'warning' : 'error',
        });
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = stylelint.createPlugin(ruleName, ruleFunction);
