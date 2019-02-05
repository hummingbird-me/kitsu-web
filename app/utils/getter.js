import { computed } from '@ember/object';

export default function getter(func) {
  return computed(func);
}
