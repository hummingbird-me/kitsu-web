import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { hrefTo } from 'ember-href-to/helpers/href-to';

export default Component.extend({
  classNames: ['audit-log-item'],
  intl: service(),

  init() {
    this._super(...arguments);
    get(this, 'buildMessageTask').perform().then(message => {
      set(this, 'message', message);
    });
  },

  buildMessageTask: task(function* () {
    const targetType = get(this, 'item.target.modelType');
    const verb = get(this, 'item.verb');
    switch (targetType) {
      // ban, invite, permission
      case 'user': {
        const user = get(this, 'item.target.name');
        return get(this, 'intl').t(`groups.dashboard.audit.${targetType}.${verb}`, {
          user,
          link: hrefTo(this, 'users.index', get(user, 'url'))
        });
      }

      // neighbor
      case 'group': {
        const group = get(this, 'item.target.name');
        return get(this, 'intl').t(`groups.dashboard.audit.${targetType}.${verb}`, {
          group,
          link: hrefTo(this, 'groups.group.group-page.index', get(this, 'item.target.slug'))
        });
      }

      // reports
      case 'group-report': {
        return get(this, 'intl').t(`groups.dashboard.audit.${targetType}.${verb}`);
      }

      // tickets
      case 'group-ticket': {
        if (verb === 'assigned') {
          yield this._loadRelationship('assignee');
          const user = get(this, 'item.target.assignee.name');
          return get(this, 'intl').t(`groups.dashboard.audit.${targetType}.${verb}`, {
            user,
            link: hrefTo(this, 'users.index', get(user, 'url'))
          });
        }
        return get(this, 'intl').t(`groups.dashboard.audit.${targetType}.${verb}`);
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
