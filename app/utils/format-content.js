import { isEmpty } from '@ember/utils';
/* global emojione */

export default function formatContent(content) {
  if (isEmpty(content)) {
    return '';
  }

  // Convert unicode and :emoji: content into Emojione images
  return typeof emojione !== 'undefined' ? emojione.toImage(content) : content;
}
