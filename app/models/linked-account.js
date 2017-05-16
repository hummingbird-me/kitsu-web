import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  externalUserId: [
    validator('presence', true),
  ],
  token: [
    validator('presence', true),
  ]
});

export default Base.extend(Validations, {
  disabledReason: attr('string'),
  externalUserId: attr('string'),
  kind: attr('string'),
  shareFrom: attr('boolean'),
  shareTo: attr('boolean'),
  syncTo: attr('boolean'),
  token: attr('string'),

  user: belongsTo('user'),

  libraryEntryLogs: hasMany('library-entry-log', { async: false }),
});
