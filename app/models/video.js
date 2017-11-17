import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed, getProperties } from '@ember/object';

// TODO: move to a global location so we can reuse these
const LANGUAGES = {
  EN: 'English',
  JP: 'Japanese',
  ES: 'Spanish'
};

export default Base.extend({
  url: attr('string'),
  canonicalTitle: attr('string'),
  availableRegions: attr('array'),
  dubLang: attr('string'),
  subLang: attr('string'),
  embedData: attr('object'),

  episode: belongsTo('episode'),
  streamer: belongsTo('streamer'),

  languageTitle: computed('dubLang', 'subLang', function () {
    const { subLang, dubLang } = getProperties(this, 'subLang', 'dubLang');
    if (dubLang !== 'JP') return `${LANGUAGES[dubLang]} Dub`;
    return `${LANGUAGES[subLang]} Sub`;
  })
});
