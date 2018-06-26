import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  content: attr('object'),
  uploadOrder: attr('number'),

  user: belongsTo('user', { inverse: 'uploads' }),
  owner: belongsTo('-upload-owner', { inverse: 'uploads' })
});
