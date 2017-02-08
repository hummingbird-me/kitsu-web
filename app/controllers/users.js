import Controller from 'ember-controller';
import computed, { alias } from 'ember-computed';
import get from 'ember-metal/get';
import { image } from 'client/helpers/image';

export default Controller.extend({
  isEditing: false,
  user: alias('model'),

  coverImageStyle: computed('user.coverImage', {
    get() {
      const coverImage = image(get(this, 'user.coverImage'));
      return `background-image: url("${coverImage}")`.htmlSafe();
    }
  }).readOnly()
});
