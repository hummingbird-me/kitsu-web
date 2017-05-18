import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import DataErrorMixin from 'client/mixins/routes/data-error';
import CanonicalRedirectMixin from 'client/mixins/routes/canonical-redirect';
import RSVP from 'rsvp';

export default Route.extend(DataErrorMixin, CanonicalRedirectMixin, {
  queryCache: service(),

  model({ slug }) {
    if (slug.match(/\D+/)) {
      return get(this, 'queryCache').query('group', { filter: { slug } }).then((records) => {
        const record = get(records, 'firstObject');
        return this._getMembership(record).then((membership) => {
          set(record, 'userMembership', membership);
          return record;
        });
      });
    }
    return get(this, 'store').findRecord('group', slug);
  },

  serialize(model) {
    return { slug: get(model, 'slug') };
  },

  _getMembership(group) {
    if (!group || !get(this, 'session.hasUser')) { return RSVP.resolve(); }
    return get(this, 'queryCache').query('group-member', {
      include: 'user,permissions',
      filter: {
        query_group: get(group, 'id'),
        query_user: get(this, 'session.account.id')
      }
    }).then(records => get(records, 'firstObject'));
  }
});
