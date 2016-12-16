import Ember from 'ember';
import config from 'client/config/environment';

const {
  Inflector: { inflector }
} = Ember;

export function initialize() {
  inflector.uncountable('anime');
  inflector.uncountable('manga');
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
