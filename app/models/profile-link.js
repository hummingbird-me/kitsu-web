import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { regularExpressions } from 'ember-validators/format';

export default Base.extend({
  url: attr('string'),

  profileLinkSite: belongsTo('profile-link-site'),
  user: belongsTo('user', { inverse: 'profileLinks' }),

  site: alias('profileLinkSite'),
  isURL: computed('url', function() {
    const url = get(this, 'url');
    return regularExpressions.url.test(url);
  }).readOnly()
});
