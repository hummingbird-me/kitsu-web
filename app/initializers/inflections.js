import Ember from 'ember';

const {
  Inflector: { inflector }
} = Ember;

export function initialize() {
  inflector.uncountable('anime');
  inflector.uncountable('manga');
}

export default {
  name: 'inflections',
  initialize
};
