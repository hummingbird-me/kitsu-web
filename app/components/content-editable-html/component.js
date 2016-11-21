import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import Ember from 'ember';
import { isEmpty } from 'ember-utils';
import { task } from 'ember-concurrency';
import ContentEditable from 'ember-content-editable/components/content-editable';


const { on } = Ember;

export default ContentEditable.extend({
  ajax: service(),

  type: 'text',

  setFormattedValue(formattedValue){
    let $content = this.$('<div/>');
    let $lastLine;

    $content.html(formattedValue);

    this._clear($content);
    this.$().html($content.html());

    this.$('.onebox').attr('contenteditable', 'false').each((i, el) => {
      $lastLine = this.$('<div><br/></div>');
      this.$(el).after($lastLine);
    });

    if ($lastLine) {
      const selection = window.getSelection();
      const range = document.createRange();

      range.setStart($lastLine.get(0).childNodes[0], 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  },

  setValue() {
    if (this.element) {
      let value = get(this, 'value');

      if (value) {
        value.split(/\n/).forEach((line) => {
          let textLine = this.$('<div/>').text(line);

          this.$().append(textLine);
        });
      }
    }
  },

  updateValue: on('keyUp', function(event) {
    let { keyCode } = event;

    this._processInput();
    this.handleKeyUp(event);

    if (keyCode == 13 || keyCode == 32) {
      let content = this.$().text();

      if (this._hasUrls(content)) {

        get(this, 'format').perform(this._getInputValue());
      }
    }
  }),

  format: task(function* (url) {
    yield get(this, 'ajax').request('/format_content', {
      data: { content: url }
    }).then((response) => {
      const formattedContent = get(response, 'content_formatted');

      this.setFormattedValue(formattedContent);
    });
  }).enqueue(),

  handlePaste(event, _this) {
    const currentVal = _this._getInputValue();

    if (!isEmpty(get(_this, 'maxlength'))) {
      event.preventDefault();

      const selection = window.getSelection();

      if (selection.rangeCount > 0) {
        const oldRange = selection.getRangeAt(0);
        let $startContainer = _this.$(oldRange.startContainer);
        let $endContainer = _this.$(oldRange.endContainer);
        let start = oldRange.startOffset;
        const end = oldRange.endOffset;
        const range = document.createRange();
        const freeSpace = get(_this, 'maxlength') - currentVal.length + (end - start);
        const content = event.originalEvent.clipboardData.getData('text').substring(0, freeSpace);
        const firstPart = $startContainer.text().slice(0, start);
        const secondPart = $endContainer.text().slice(end);
        const newVal = `${firstPart}${content}${secondPart}`;
        let childCount = _this.element.childNodes.length;
        let firstIndex = 0;
        let found = false;
        let $lastLine;

        if (!$startContainer.parent().hasClass('ember-content-editable')) {
          $startContainer = $startContainer.parent();
        }

        if (!$endContainer.parent().hasClass('ember-content-editable')) {
          $endContainer = $endContainer.parent();
        }

        if (childCount === 0) {
          $lastLine = _this._appendContent(content);
        } else {
          for (let i = 0; i < childCount; i++) {
            let el = _this.element.childNodes[firstIndex];

            if (el === $startContainer.get(0)) {
              firstIndex = i;
              found = true;
            }
            if (el === $endContainer.get(0)) {
              let lines = newVal.split('\n');
              let $newLine;

              lines.forEach((line, i) => {
                if (i === 0) {
                  $lastLine = _this.$(`<div>${line}</div>`);
                  _this.$(el).replaceWith($lastLine);
                } else {
                  start = 0;
                  $newLine = _this.$(`<div>${line}</div>`);
                  $lastLine.after($newLine);
                  $lastLine = $newLine;
                }
              });

              break;
            } else if (found) {
              _this.$(el).remove();
            } else {
              firstIndex = i + 1;
            }
          }

          if (!found) {
            $lastLine = _this._appendContent(content);
          }
        }

        set(this, '_observeValue', false);
        set(_this, 'value', _this._getInputValue());
        set(this, '_observeValue', true);

        let lines = content.split('\n');

        range.setStart($lastLine.get(0).childNodes[0], start + lines[lines.length - 1].length);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }

    let value = get(this, 'value');
    set(this, '_observeValue', false);

    if (!get(this, 'allowNewlines')) {
      value = value.toString().replace(/\n/g, ' ');
    }

    if (get(this, 'type') === 'number') {
      value = value.toString().replace(/[^0-9]/g, '');
    }

    set(this, 'value', value);
    set(this, '_observeValue', true);
  },

  _clear($el){
    $el.find('p').each((i, el) => {
      let $child = this.$(el);

      this._clear($child);
      $child.replaceWith(`<div>${$child.html()}</div>`);
    });
  },

  _appendContent(content){
    let lines = content.split('\n');
    let $lastLine;

    lines.forEach((line) => {
      $lastLine = this.$(`<div>${line}</div>`);
      this.$().append($lastLine);
    });

    return $lastLine;
  },

  _getInputValue() {
    const $clonedContent = this.$('<div/>').html(this.$().html());

    $clonedContent.find('iframe, img').each((i, media) => $(media).replaceWith(media.src));
    $clonedContent.find('div, p').each((i, line) => $(line).replaceWith(`\n${$(line).html()}`));
    return $clonedContent.get(0).innerText || $clonedContent.get(0).textContent;
  },

  _hasUrls(str){
    const urlPattern = /(https?:)?\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;

    return !!str.match(urlPattern);
  }
});
