import { helper } from 'ember-helper';

export function imgixUrl([src, params = {}]) {
  const url = new URL(
    src
      .replace('https://media.kitsu.io/', 'https://kitsu.imgix.net/')
      .replace(
        'https://media-staging.kitsu.io/',
        'https://kitsu-staging.imgix.net/'
      )
  );
  const existingParams = Object.fromEntries(new URLSearchParams(url.search));
  const options = new URLSearchParams({
    ...existingParams,
    auto: 'format',
    fm: 'png',
    ch: 'Width,DPR',
    ...params
  });
  url.search = options.toString();
  return url.toString();
}

export default helper(imgixUrl);
