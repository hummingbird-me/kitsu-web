/* eslint-disable import/prefer-default-export */
export function prependObjects(context, objects) {
  context.beginPropertyChanges();
  objects.forEach((object) => {
    if (context.includes(object) === false) {
      context.insertAt(0, object);
    }
  });
  context.endPropertyChanges();
}
