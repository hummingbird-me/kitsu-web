import Model from 'ember-data/model';
import getter from 'client/utils/getter';

/**
 * Ember Data doesn't currently allow polymorphic relationships to have
 * a base model that doesn't exist.
 *
 * Open Issue: https://github.com/emberjs/data/issues/4377
 *
 * Provides a `modelType` property to get the modelName easily without the need to
 * determine if we're dealing with a proxy or model instance.
 */
export default Model.extend({
  modelType: getter(function() {
    return this.constructor.modelName;
  })
});
