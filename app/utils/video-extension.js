function _isYouTube(url) {
  let found = false;

  if (typeof url === 'string') {
    const pos = url.indexOf('youtube.com');

    found = (pos > -1);
  }

  return found;
}

rangy.init();

export default MediumEditor.extensions.button.extend({
  name: 'video',
  tagNames: ['video'],
  contentDefault: '<b>video</b>',
  aria: 'Video',
  action: 'video',

  init() {
    MediumEditor.extensions.button.prototype.init.call(this);

    this.classApplier = rangy.createClassApplier('video-preview', {
      elementTagName: 'video',
      elementAttributes: {
        controls: 'true',
        src: ''
      },
      normalize: true
    });

    this.youtubeApplier = rangy.createClassApplier('video-preview', {
      elementTagName: 'iframe',
      elementAttributes: {
        src: ''
      },
      normalize: true
    });
  },

  handleClick() {
    const node = rangy.getSelection().nativeSelection.baseNode;
    const text = node.data;
    const activeElement = MediumEditor.selection.getSelectionElement(this.window);
    const applier = _isYouTube(text) ? this.youtubeApplier : this.classApplier;

    applier.elementAttributes.src = text;

    applier.toggleSelection();

    this.base.events.updateInput(activeElement, {
      target: activeElement,
      currentTarget: activeElement
    });
  }
});