import get from 'ember-metal/get';
import set from 'ember-metal/set';

// eslint-disable-next-line import/prefer-default-export
export function createArrayWithLinks(data) {
  const res = data.toArray();
  set(res, 'links', get(data, 'links'));
  return res;
}

export function unshiftObject(target, object) {
  const included = target.includes(object);
  if (!included) {
    target.insertAt(0, object);
  }
  return target;
}

export function unshiftObjects(target, objects) {
  target.beginPropertyChanges();
  objects.reverse().forEach((object) => { unshiftObject(target, object); });
  target.endPropertyChanges();
  return target;
}
