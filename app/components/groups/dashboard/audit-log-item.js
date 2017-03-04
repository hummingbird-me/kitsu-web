import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';
import { task } from 'ember-concurrency';
import { hrefTo } from 'ember-href-to/helpers/href-to';

export default Component.extend({
  classNames: ['audit-log-item'],
  intl: service(),

  init() {
    this._super(...arguments);
    get(this, 'buildMessageTask').perform().then((message) => {
      set(this, 'message', message);
    });
  },

  buildMessageTask: task(function* () {
    const targetType = get(this, 'item.target.modelType');
    const verb = get(this, 'item.verb');
    switch (targetType) {
      case 'group-ban':
      case 'group-invite': {
        yield this._loadRelationship('user');
        const user = get(this, 'item.target.user.name');
        return get(this, 'intl').t(`groups.dashboard.audit.${targetType}.${verb}`, {
          user,
          link: hrefTo(this, 'users.index', user)
        });
      }
      case 'group-neighbor': {
        yield this._loadRelationship('destination');
        const group = get(this, 'item.target.destination.name');
        return get(this, 'intl').t(`groups.dashboard.audit.group-neighbor.${verb}`, {
          group,
          link: hrefTo(this, 'groups.group.group-page.index', group)
        });
      }
      case 'group-permission': {
        yield this._loadRelationship('groupMember');
        yield this._loadRelationship('user', 'item.target.groupMember.content');
        const permission = capitalize(get(this, 'item.target.permission'));
        const user = get(this, 'item.target.groupMember.user.name');
        return get(this, 'intl').t(`groups.dashboard.audit.group-permission.${verb}`, {
          permission,
          user,
          link: hrefTo(this, 'users.index', user)
        });
      }
      case 'group-report': {
        return get(this, 'intl').t(`groups.dashboard.audit.group-report.${verb}`, {
          link: '#'
        });
      }
      case 'group-ticket': {
        if (verb === 'assigned') {
          yield this._loadRelationship('assignee');
          const user = get(this, 'item.target.assignee.name');
          return get(this, 'intl').t('groups.dashboard.audit.group-ticket.assigned', {
            user,
            ticketLink: '#',
            userLink: hrefTo(this, 'users.index', user)
          });
        }
        return get(this, 'intl').t('groups.dashboard.audit.group-ticket.resolved', {
          ticketLink: '#'
        });
      }
      default: {
        return '';
      }
    }
  }),

  _loadRelationship(relationship, target = 'item.target.content') {
    return get(this, target).belongsTo(relationship).load();
  }
});
