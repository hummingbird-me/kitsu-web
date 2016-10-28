import Component from 'ember-component';
import get from 'ember-metal/get';
import getter from 'client/utils/getter';

export default Component.extend({
  classNames: ['stream-item', 'row'],

  activity: getter(function() {
    return get(this, 'group.activities.firstObject');
  }),

  follow: getter(function() {
    return get(this, 'activity.subject');
  })
});
