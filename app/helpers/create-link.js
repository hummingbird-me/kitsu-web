import Helper from 'ember-helper';
import { hrefTo } from 'ember-href-to/helpers/href-to';

export function createLink(href, text) {
  return `<a href="${href}">${text}</a>`.htmlSafe();
}

export default Helper.extend({
  compute([text, targetRouteName, ...args]) {
    const href = hrefTo(this, targetRouteName, ...args);
    return createLink(href, text);
  }
});
