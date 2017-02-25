import Controller from 'ember-controller';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import computed, { alias } from 'ember-computed';
import { htmlSafe } from 'ember-string';
import { image } from 'client/helpers/image';

export default Controller.extend({
  store: service(),
  group: alias('model'),

  coverImageStyle: computed('group.coverImage', function() {
    const coverImage = image(get(this, 'group.coverImage'));
    return htmlSafe(`background-image: url("${coverImage}")`);
  }).readOnly()
});
