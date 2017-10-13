import Controller from '@ember/controller';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { htmlSafe } from '@ember/string';
import { image } from 'client/helpers/image';

export default Controller.extend({
  store: service(),
  group: alias('model.group'),
  membership: alias('model.membership'),

  coverImageStyle: computed('group.coverImage', function() {
    const coverImage = image(get(this, 'group.coverImage'));
    return htmlSafe(`background-image: url("${coverImage}")`);
  }).readOnly()
});
