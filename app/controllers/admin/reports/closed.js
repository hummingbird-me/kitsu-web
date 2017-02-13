import Controller from 'ember-controller';
import { reads } from 'ember-computed';

export default Controller.extend({
  taskValue: reads('model.taskInstance.value')
});
