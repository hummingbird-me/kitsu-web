import Model from 'ember-data/model';

/**
 * Ember Data doesn't currently allow polymorphic relationships to have
 * a base model that doesn't exist.
 *
 * Open Issue: https://github.com/emberjs/data/issues/4377'
 */
export default Model.extend();
