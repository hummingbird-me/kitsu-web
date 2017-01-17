import Base from 'client/models/base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import computed, { alias } from 'ember-computed';
import get from 'ember-metal/get';
import { regularExpressions } from 'ember-validators/format';

export default Base.extend({
  url: attr('string'),

  profileLinkSite: belongsTo('profile-link-site'),
  user: belongsTo('user', { inverse: 'profileLinks' }),

  site: alias('profileLinkSite'),
  isURL: computed('url', {
    get() {
      const url = get(this, 'url');
      return !regularExpressions.url.test(url);
    }
  }).readOnly()
});
