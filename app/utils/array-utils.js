export function unshiftObject(target, object) {
  const included = target.includes(object);
  if (!included) {
    target.insertAt(0, object);
  }
  return target;
}

export function unshiftObjects(target, objects) {
  target.beginPropertyChanges();
  objects.reverse().forEach(object => { unshiftObject(target, object); });
  target.endPropertyChanges();
  return target;
}
