import { helper } from 'ember-helper';

export function subtract([minuend, subtrahend]) {
  return minuend - subtrahend;
}

export default helper(subtract);
