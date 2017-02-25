import Base from 'client/models/-base';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  destination: belongsTo('group'),
  source: belongsTo('group'),
});
