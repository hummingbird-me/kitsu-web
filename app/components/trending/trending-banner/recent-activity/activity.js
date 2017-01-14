import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

/**
 * TODO: Shares logic with the stream-feed component that should be extracted to share.
 */
export default Component.extend({
  init() {
    this._super(...arguments);
    const [group] = this._groupActivities().slice(0, 1);
    set(this, 'activity', get(group, 'activity'));
    set(this, 'others', get(group, 'others'));
    set(this, 'group', group);
  },

  _groupActivities() {
    const grouping = {};
    const group = get(this, 'group');
    const activities = get(group, 'activities');
    activities.forEach((activity) => {
      const key = this._getGroupingKey(activity);
      grouping[key] = grouping[key] || [];
      grouping[key].addObject(activity);
    });
    const result = [];
    Object.keys(grouping).forEach((key) => {
      const groupedActivities = grouping[key];
      const others = groupedActivities.toArray().slice(1).reject(activity => (
        get(activity, 'actor.id') === get(groupedActivities, 'firstObject.actor.id')
      ));
      const activity = get(groupedActivities, 'firstObject');
      result.addObject({ activity, others });
    });
    return result;
  },

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
  }
});
