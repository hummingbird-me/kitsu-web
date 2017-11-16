import config from 'client/config/environment';
import Inflector from 'ember-inflector';

export function initialize() {
  Inflector.inflector.uncountable('anime');
  Inflector.inflector.uncountable('manga');
}

const result = {
  name: 'inflections',
  initialize
};

// run before mirage in testing, we can't do this by default as mirage doesn't include its files
// in other environments.
if (config.environment === 'test') {
  Object.assign(result, { before: 'ember-cli-mirage' });
}

export default result;
