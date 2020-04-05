import { helper } from '@ember/component/helper';

export function profileLinkToSVG([str = '']) {
  let string = str.replace(/(\.|\!)/, '').toLowerCase();
  // Prevent conflict with Streaming logo SVG
  // TODO: Uniquely differentiate streaming logos and profile link logos in original filenames
  if (string === 'youtube') string += '2';
  return string;
}

export default helper(profileLinkToSVG);
