import Route from 'ember-route';

export default Route.extend({
  model({ slug }) {
    return get(this, 'store').query('category', {
      filter: { slug },
      include: 'parent'
    })
    .then(records => get(records, 'firstObject'));
  },
});
