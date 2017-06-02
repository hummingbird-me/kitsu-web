import Mixin from 'ember-metal/mixin';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { isEmpty } from 'ember-utils';
import { later, cancel, scheduleOnce } from 'ember-runloop';

const DISTANCE = 210;

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
        const searchElement = document.getElementById('search');
        if (document.body.scrollTop < DISTANCE && isEmpty(searchElement.value)) {
          this.fadeTimer = later(() => {
            element.classList.add('transparent');
          }, 500);
        }
        set(this, 'isHovered', false);
      };
      element.addEventListener('mouseleave', this._handleMouseLeave);
    });
  },

  deactivate() {
    this._super(...arguments);
    const element = document.getElementById('kitsu-navbar');
    document.body.classList.remove('cover-page');
    document.removeEventListener('scroll', this._handleScroll);
    element.removeEventListener('mouseenter', this._handleMouseEnter);
    element.removeEventListener('mouseleave', this._handleMouseLeave);
  },

  handleScroll() {
    const element = document.getElementById('kitsu-navbar');
    const searchElement = document.getElementById('search');
    if (document.body.scrollTop >= DISTANCE) {
      element.classList.remove('transparent');
    } else if (!get(this, 'isHovered') && isEmpty(searchElement.value)) {
      element.classList.add('transparent');
    }
  }
});
