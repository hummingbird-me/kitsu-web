import { isEmpty } from '@ember/utils';
/* global emojione */

function embedLinkElements(content) {
  // find current theme loaded
  const element = [].slice.call(document.head.getElementsByTagName('link'), 0).find(link => (
    'theme' in link.dataset
  ));
  const theme = element ? element.dataset.theme : 'light';
  const replace = `class="autolink embedly-card" data-card-theme=${theme}`;
  return content.replace(/class="autolink"/g, replace);
}

export default function formatContent(content, embed = true) {
  if (isEmpty(content)) {
    return '';
  }

  // Convert unicode and :emoji: content into Emojione images
  let parsedContent = typeof emojione !== 'undefined' ? emojione.toImage(content) : content;

  // Convert <a/> links into embedly cards
  if (embed) {
    parsedContent = embedLinkElements(parsedContent);
  }

  return parsedContent;
}
