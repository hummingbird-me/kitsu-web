import get from 'ember-metal/get';
import set from 'ember-metal/set';

/* eslint-disable import/prefer-default-export */
export function prependObjects(context, objects) {
  context.beginPropertyChanges();
  objects.reverse().forEach((object) => {
    if (context.includes(object) === false) {
      context.insertAt(0, object);
    }
  });
  context.endPropertyChanges();
}

export function createArrayWithLinks(data) {
  const res = data.toArray();
  set(res, 'links', get(data, 'links'));
  return res;
}
