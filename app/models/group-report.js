import ReportModel from 'client/models/report';
import { belongsTo } from 'ember-data/relationships';

export default ReportModel.extend({
  group: belongsTo('group')
});
