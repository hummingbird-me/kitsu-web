import Controller from 'ember-controller';
import { fork } from 'client/utils/computed-macros';

export default Controller.extend({
  taskValue: fork('_taskValue', 'model.taskInstance.value'),
});
