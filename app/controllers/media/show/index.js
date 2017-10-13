import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';

export default Controller.extend({
  entry: alias('parent.entry'),
  media: alias('parent.media')
});
