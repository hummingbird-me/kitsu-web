import { helper } from 'ember-helper';
import get from 'ember-metal/get';

export function mediaType([media]) {
  return media.constructor.modelName || (get(media, 'content') && get(media, 'content').constructor.modelName);
}

export default helper(mediaType);
