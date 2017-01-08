export default function getTitleField(preference) {
  switch (preference) {
    case 'english':
      return 'en';
    case 'romanized':
      return 'en_jp';
    default:
      return undefined;
  }
}
