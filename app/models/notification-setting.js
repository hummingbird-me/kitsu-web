import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  settingType: attr('string'),
  emailEnabled: attr('boolean'),
  mobileEnabled: attr('boolean'),
  webEnabled: attr('boolean'),

  user: belongsTo('user', { inverse: 'notificationSettings' })
});
