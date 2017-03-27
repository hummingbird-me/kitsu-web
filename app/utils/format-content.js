import jQuery from 'jquery';
/* global emojione */

function embedLinkElements(content) {
  const elements = jQuery(content);
  elements.find('a.autolink').each((index, element) => {
    jQuery(element).addClass('embedly-card');
  });
  return elements.map((index, element) => jQuery(element).html()).get().join('');
}

export default function formatContent(content, embed = true) {
  // Convert unicode and :emoji: content into Emojione images
  let parsedContent = typeof emojione !== 'undefined' ? emojione.toImage(content) : content;

  // Convert <a/> links into embedly cards
  if (embed) {
    parsedContent = embedLinkElements(parsedContent);
  }

  return parsedContent;
}
