import Controller from 'ember-controller';
import computed, { alias } from 'ember-computed';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { image } from 'client/helpers/image';

export default Controller.extend({
  media: alias('model'),
  session: service(),

  coverImageStyle: computed('media.coverImage', {
    get() {
      const coverImage = image(get(this, 'media.coverImage'));
      return `background-image: url("${coverImage}")`.htmlSafe();
    }
  }).readOnly()
});
