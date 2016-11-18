import { helper } from 'ember-helper';
import get from 'ember-metal/get';

export function modelType([model]) {
  return model.constructor.modelName || (get(model, 'content') && get(model, 'content').constructor.modelName);
}

export default helper(modelType);
