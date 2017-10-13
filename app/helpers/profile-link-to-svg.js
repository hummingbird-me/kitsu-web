import { helper } from '@ember/component/helper';

export function profileLinkToSVG([str = '']) {
  return str.replace(/(\.|\!)/, '').toLowerCase();
}

export default helper(profileLinkToSVG);
