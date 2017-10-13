import Controller from '@ember/controller';
import { concat } from 'client/utils/computed-macros';

export default Controller.extend({
  notifications: concat('model.taskInstance.value', 'model.paginatedRecords')
});
