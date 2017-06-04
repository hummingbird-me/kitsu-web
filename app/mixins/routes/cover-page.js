import Mixin from 'ember-metal/mixin';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { isEmpty } from 'ember-utils';
import { later, cancel, scheduleOnce } from 'ember-runloop';
import { scheduleRead } from 'spaniel';

const DISTANCE = 210;
const HOVER_DELAY = 500;

export default Mixin.create({
  isHovered: false,

  activate() {
    this._super(...arguments);
    this._handleScroll = () => { this.handleScroll(); };

    document.body.classList.add('cover-page');
    document.addEventListener('scroll', this._handleScroll);
    scheduleOnce('afterRender', () => {
      this.handleScroll();
      const element = document.getElementById('kitsu-navbar');

      this._handleMouseEnter = () => {
        cancel(this.fadeTimer);
        element.classList.remove('transparent');
        set(this, 'isHovered', true);
      };
      element.addEventListener('mouseenter', this._handleMouseEnter);

      this._handleMouseLeave = () => {
        scheduleRead(() => {
          const searchElement = document.getElementById('search');
          const scrollPoint = document.scrollingElement && document.scrollingElement.scrollTop;
          if (scrollPoint < DISTANCE && isEmpty(searchElement.value)) {
            this.fadeTimer = later(() => {
              element.classList.add('transparent');
            }, HOVER_DELAY);
          }
          set(this, 'isHovered', false);
        });
      };
      element.addEventListener('mouseleave', this._handleMouseLeave);
    });
  },

  deactivate() {
    this._super(...arguments);
    document.body.classList.remove('cover-page');
    document.removeEventListener('scroll', this._handleScroll);
    const element = document.getElementById('kitsu-navbar');
    if (element) {
      element.removeEventListener('mouseenter', this._handleMouseEnter);
      element.removeEventListener('mouseleave', this._handleMouseLeave);
    }
    set(this, 'isHovered', false);
  },

  handleScroll() {
    scheduleRead(() => {
      const element = document.getElementById('kitsu-navbar');
      const searchElement = document.getElementById('search');
      if (document.scrollingElement && document.scrollingElement.scrollTop >= DISTANCE) {
        element.classList.remove('transparent');
      } else if (!get(this, 'isHovered') && isEmpty(searchElement.value)) {
        element.classList.add('transparent');
      }
    });
  }
});
