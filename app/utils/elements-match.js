// Replacement for jQuery(element).is(selector)
export default (element, selector) => element.matches.call(element, selector);
