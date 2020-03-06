import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { strictInvokeAction } from 'ember-invoke-action';

export default Component.extend({
  shouldGroup: computed('feedId', function() {
    const [feed] = get(this, 'feedId').split(':');
    return feed !== 'user_aggr';
  }).readOnly(),

  groupedActivities: computed('activities.@each.isDeleted', function() {
    if (get(this, 'shouldGroup') === false) {
      return get(this, 'activities')
        .filterBy('isDeleted', false)
        .map(activity => ({ activity })).slice(0, get(this, 'activityLimit'));
    }
    const groups = {};
    const activities = get(this, 'activities').filterBy('isDeleted', false);
    activities.forEach(activity => {
      const key = this._getGroupingKey(activity);
      groups[key] = groups[key] || [];
      groups[key].addObject(activity);
    });
    const result = [];
    Object.keys(groups).forEach(key => {
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
      default:
        throw new Error('Unsupported activity.');
    }
  },

  actions: {
    onDelete(activity) {
      get(this, 'activities').removeObject(activity);
      if (get(this, 'activities.length') === 0) {
        strictInvokeAction(this, 'removeGroup');
      }
    }
  }
});
