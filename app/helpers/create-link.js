import Helper from 'ember-helper';
import { hrefTo } from 'ember-href-to/helpers/href-to';
import { htmlSafe } from 'ember-string';

export function createLink(href, text) {
  return htmlSafe(`<a href="${href}">${text}</a>`);
}

export default Helper.extend({
  compute([text, targetRouteName, ...args]) {
    const href = hrefTo(this, targetRouteName, ...args);
    return createLink(href, text);
  }
});
