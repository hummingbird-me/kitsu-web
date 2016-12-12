import Ember from 'ember';
import Config from 'client/config/environment';

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

if (Config.environment === 'test') {
  Object.assign(result, { before: 'ember-cli-mirage' });
}

export default result;
