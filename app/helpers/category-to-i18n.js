import { helper } from '@ember/component/helper';

export function categoryToI18n([str = '']) {
  const string = str.replace(/(\.|\!)/, '').toLowerCase();
  return `category.${string}`;
}

export default helper(categoryToI18n);
