import Config from 'client/config/environment';

export function initialize() {
  if (Config.isStaging === true) {
    const element = document.createElement('script');
    element.async = true;
    element.src = 'https://www.bugherd.com/sidebarv2.js?apikey=bdrrbvrlqikxgg6d3rbcwq';
    const script = document.getElementsByTagName('script')[0];
    script.parentNode.insertBefore(element, script);
  }
}

export default {
  name: 'bugherd',
  after: 'google-adsense',
  initialize
};
