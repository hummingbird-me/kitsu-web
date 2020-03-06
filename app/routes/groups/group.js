import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import DataErrorMixin from 'client/mixins/routes/data-error';
import CanonicalRedirectMixin from 'client/mixins/routes/canonical-redirect';
import RSVP from 'rsvp';

export default Route.extend(DataErrorMixin, CanonicalRedirectMixin, {
  queryCache: service(),

  model({ slug }) {
    if (slug.match(/\D+/)) {
      return get(this, 'queryCache').query('group', { filter: { slug } }).then(records => {
        const record = get(records, 'firstObject');
        return this._getMembership(record).then(membership => {
          set(record, 'userMembership', membership);
          return record;
        });
      });
    }
    return get(this, 'store').findRecord('group', slug, { reload: true });
  },

  afterModel(model) {
    this._super(...arguments);
    set(this, 'breadcrumb', get(model, 'name'));
    const tags = this.setHeadTags(model);
    set(this, 'headTags', tags);
  },

  serialize(model) {
    return { slug: get(model, 'slug') };
  },

  setHeadTags(model) {
    return [{
      type: 'meta',
      tagId: 'meta-description',
      attrs: {
        property: 'description',
        content: get(model, 'tagline')
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-title',
      attrs: {
        property: 'og:title',
        content: get(model, 'name')
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-description',
      attrs: {
        property: 'og:description',
        content: get(model, 'tagline')
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-image',
      attrs: {
        property: 'og:image',
        content: get(model, 'avatar.large') || get(model, 'avatar')
      }
    }, {
      type: 'meta',
      tagId: 'meta-twitter-label1',
      attrs: {
        property: 'twitter:label1',
        content: 'Members'
      }
    }, {
      type: 'meta',
      tagId: 'meta-twitter-data1',
      attrs: {
        property: 'twitter:data1',
        content: get(model, 'membersCount')
      }
    }];
  },

  _getMembership(group) {
    if (!group || !get(this, 'session.hasUser')) { return RSVP.resolve(); }
    return get(this, 'queryCache').query('group-member', {
      include: 'user,permissions',
      filter: {
        group: get(group, 'id'),
        user: get(this, 'session.account.id')
      }
    }).then(records => get(records, 'firstObject'));
  }
});
