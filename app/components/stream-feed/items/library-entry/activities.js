import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Component.extend({
  shouldGroup: computed('feedId', {
    get() {
      const [feed] = get(this, 'feedId').split(':');
      return feed !== 'user_aggr';
    }
  }).readOnly(),

  groupedActivities: computed('activities', {
    get() {
      if (get(this, 'shouldGroup') === false) {
        return get(this, 'activities')
          .map(activity => ({ activity })).slice(0, get(this, 'activityLimit'));
      }
      const groups = {};
      const activities = get(this, 'activities');
      activities.forEach((activity) => {
        const key = this._getGroupingKey(activity);
        groups[key] = groups[key] || [];
        groups[key].addObject(activity);
      });
      const result = [];
      Object.keys(groups).forEach((key) => {
        const group = groups[key];
        const others = group.toArray().slice(1).reject(a => (
          get(a, 'actor.id') === get(group, 'firstObject.actor.id')
        ));
        result.addObject({
          activity: get(group, 'firstObject'),
          others
        });
      });
      return result.slice(0, get(this, 'activityLimit'));
    }
  }).readOnly(),

  _getGroupingKey(activity) {
    const verb = get(activity, 'verb');
    switch (verb) {
      case 'updated':
        return `${verb}_${get(activity, 'status')}`;
      case 'progressed':
        return `${verb}_${get(activity, 'progress')}`;
      case 'rated':
        return `${verb}_${get(activity, 'rating')}`;
      case 'reviewed':
        return verb;
      default:
        throw new Error('Unsupported activity.');
    }
  }
});
