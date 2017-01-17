import { helper } from 'ember-helper';

export function profileLinkToSVG([str]) {
  return str.replace(/(\.|\!)/, '').toLowerCase();
}

export default helper(profileLinkToSVG);
