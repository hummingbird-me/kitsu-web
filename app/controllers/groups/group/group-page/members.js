import Controller from '@ember/controller';
import { concat } from 'client/utils/computed-macros';

export default Controller.extend({
  taskValue: concat('model.taskInstance.value', 'model.paginatedRecords')
});
