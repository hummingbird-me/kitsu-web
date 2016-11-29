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
        controls: 'true'
      },
      normalize: true
    });

    this.classApplier.onElementCreate = function(el) {
      const sel = rangy.getSelection();
      const node = sel.nativeSelection.baseNode;
      const text = node.data;
      const source = document.createElement('source');

      source.src = text;
      source.type = 'video/mp4';

      el.appendChild(source);
    };
  },

  handleClick() {
    this.classApplier.toggleSelection();

    try {
      this.base.checkContentChanged();
    } catch(e) {
      console.log(e);
    }
  }
});