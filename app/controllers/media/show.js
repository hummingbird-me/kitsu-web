import Controller from '@ember/controller';
import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { image } from 'client/helpers/image';

export default Controller.extend({
  media: alias('model'),

  coverImageStyle: computed('media.coverImage', function() {
    const coverImage = image(get(this, 'media.coverImage'));
    return `background-image: url("${coverImage}")`.htmlSafe();
  }).readOnly()
});
