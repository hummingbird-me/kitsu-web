import { isEmpty } from '@ember/utils';
/* global emojione */

export default function formatContent(content, embed = true) {
  if (isEmpty(content)) {
    return '';
  }

  // Convert unicode and :emoji: content into Emojione images
  let parsedContent = typeof emojione !== 'undefined' ? emojione.toImage(content) : content;

  return parsedContent;
}
