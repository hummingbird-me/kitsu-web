import Controller from 'ember-controller';
import computed, { alias } from 'ember-computed';
import get from 'ember-metal/get';
import { image } from 'client/helpers/image';

export default Controller.extend({
  media: alias('model'),

  coverImageStyle: computed('media.coverImage', function() {
    const coverImage = image(get(this, 'media.coverImage'));
    return `background-image: url("${coverImage}")`.htmlSafe();
  }).readOnly()
});
