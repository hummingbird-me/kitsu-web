import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { alias, or } from '@ember/object/computed';
import getTitleField from 'client/utils/get-title-field';

export default Component.extend({
  kind: alias('item.kind'),
  imageUrl: or('item.avatar', 'item.posterImage'),
  title: or('item.name', 'item.computedTitle'),
  slug: or('item.slug', 'item.id'),

  computedTitle: computed('session.account.titleLanguagePreference', 'item.titles', function() {
    if (!get(this, 'session.hasUser')) {
      return get(this, 'item.canonicalTitle');
    }
    const preference = get(this, 'session.account.titleLanguagePreference').toLowerCase();
    const key = getTitleField(preference);
    return key !== undefined ? get(this, `item.titles.${key}`) || get(this, 'item.canonicalTitle') :
      get(this, 'item.canonicalTitle');
  }).readOnly(),

  imageClass: computed('item.kind', function () {
    const kind = get(this, 'item.kind');
    switch (kind) {
      case 'user':
      case 'group':
        return `is-avatar-${kind}s`;
      default:
        return '';
    }
  }).readOnly(),

  route: computed('item.kind', function () {
    const kind = get(this, 'item.kind');
    if (!kind) return 'not-found';
    switch (kind) {
      case 'user':
        return 'users.index';
      case 'group':
        return 'groups.group.group-page.index';
      default:
        return `${kind}.show`;
    }
  }).readOnly(),

  tags: computed('item.kind', 'item.subtype', 'item.nsfw', function () {
    const kind = get(this, 'item.kind');
    const subtype = get(this, 'item.subtype');
    const nsfw = get(this, 'item.nsfw');
    const out = [];
    if (subtype) out.push(`media-shared.types.${kind}.${subtype.toLowerCase()}`);
    if (nsfw) out.push('groups.nsfw');
    return out;
  }).readOnly()
});
