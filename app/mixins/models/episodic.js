import Mixin from '@ember/object/mixin';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Mixin.create({
  episodeCount: attr('number'),
  episodeLength: attr('number'),

  episodes: hasMany('episode', { inverse: 'media' })
});
