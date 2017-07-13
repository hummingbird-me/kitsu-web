import UnitsController from 'client/controllers/media/show/units';
import { concat } from 'client/utils/computed-macros';

export default UnitsController.extend({
  taskValue: concat('model.taskInstance.value', 'model.paginatedRecords'),
});
