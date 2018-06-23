export default function isFileValid(file, accept) {
  const type = file.get('blob.type');
  if (type && !accept.includes(type)) {
    return false;
  }
  const size = file.get('blob.size');
  const sizeInMb = size / 1000000;
  if (sizeInMb > 5) {
    return false;
  }
  return true;
}
