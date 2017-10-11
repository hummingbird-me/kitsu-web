import { helper } from 'ember-helper';

export function imgixUrl([src, params = {}]) {
  const filledParams = { auto: 'format', fm: 'png', ch: 'Width,DPR', ...params };
  const options = Object.keys(filledParams).map(key => (
    [key, filledParams[key]].map(encodeURIComponent).join('='))
  ).join('&');
  const imgixHost = 'https://kitsu.imgix.net/';
  const url = src.replace(/https:\/\/[^\/]+\//, imgixHost);
  return options ? `${url}&${options}` : url;
}

export default helper(imgixUrl);
