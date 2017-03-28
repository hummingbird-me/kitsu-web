/* global emojione */

function embedLinkElements(content) {
  return content.replace(/class="autolink"/g, 'class="autolink embedly-card"');
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
