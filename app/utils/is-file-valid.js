import { get } from '@ember/object';

export default function isFileValid(file, accept) {
  const type = get(file, 'type');
  if (type && !accept.includes(type)) {
    return false;
  }
  const size = get(file, 'size');
  const sizeInMb = size / 1000000;
  if (sizeInMb > 15) {
    return false;
  }
  return true;
}
