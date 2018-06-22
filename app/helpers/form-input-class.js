import { helper } from '@ember/component/helper';

export function formInputClass([invalid, valid]) {
  const klasses = ['form-control'];
  if (invalid === true) {
    klasses.push('form-control-warning');
  } else if (valid === true) {
    klasses.push('form-control-success');
  }
  return klasses.join(' ');
}

export default helper(formInputClass);
