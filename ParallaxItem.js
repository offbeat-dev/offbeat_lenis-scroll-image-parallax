import MathUtils from './MathUtils';

let winsize;
const calcWinsize = () =>
  (winsize = { width: window.innerWidth, height: window.innerHeight });
calcWinsize();

class ParallaxItem {
  constructor(el) {
    this.DOM = { el: el };
    this.DOM.image = this.DOM.el.querySelector('.content__item-img');
    this.DOM.imageWrapper = this.DOM.image.parentNode;
    this.DOM.title = this.DOM.el.querySelector('.content__item-title');
    this.docScroll = 0;
    this.renderedStyles = {
      imageScale: {
        previous: 0,
        current: 0,
        ease: 0.1,
        setValue: () => {
          const toValue = 1.5;
          const fromValue = 1;
          const val = MathUtils.map(
            this.props.top - this.docScroll,
            winsize.height,
            -1 * this.props.height,
            fromValue,
            toValue
          );
          return Math.max(Math.min(val, toValue), fromValue);
        },
      },
      innerTranslationY: {
        previous: 0,
        current: 0,
        ease: 0.1,
        setValue: () => {
          const toValue = parseInt(
            getComputedStyle(this.DOM.image).getPropertyValue('--overflow'),
            10
          );
          const fromValue = -1 * toValue;
          return Math.max(
            Math.min(
              MathUtils.map(
                this.props.top - this.docScroll,
                winsize.height,
                -1 * this.props.height,
                fromValue,
                toValue
              ),
              toValue
            ),
            fromValue
          );
        },
      },
    };
    // gets the item's height and top (relative to the document)
    this.getSize();
    // set the initial values
    this.update();
    // use the IntersectionObserver API to check when the element is inside the viewport
    // only then the element styles will be updated
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(
        (entry) => (this.isVisible = entry.intersectionRatio > 0)
      );
    });
    this.observer.observe(this.DOM.el);
    // init/bind events
    this.initEvents();
  }
  update() {
    // sets the initial value (no interpolation)
    for (const key in this.renderedStyles) {
      this.renderedStyles[key].current = this.renderedStyles[key].previous =
        this.renderedStyles[key].setValue();
    }
    // apply changes/styles
    this.layout();
  }
  getSize() {
    const rect = this.DOM.el.getBoundingClientRect();
    this.props = {
      // item's height
      height: rect.height,
      // offset top relative to the document
      top: this.docScroll + rect.top,
    };
  }
  initEvents() {
    window.addEventListener('resize', () => this.resize());
  }
  resize() {
    // gets the item's height and top (relative to the document)
    this.getSize();
    // on resize reset sizes and update styles
    this.update();
  }
  render() {
    // update the current and interpolated values
    for (const key in this.renderedStyles) {
      this.renderedStyles[key].current = this.renderedStyles[key].setValue();
      this.renderedStyles[key].previous = MathUtils.lerp(
        this.renderedStyles[key].previous,
        this.renderedStyles[key].current,
        this.renderedStyles[key].ease
      );
    }

    // and apply changes
    this.layout();
  }
  layout() {
    // scale the image
    this.DOM.image.style.transform = `translate3d(0,${this.renderedStyles.innerTranslationY.previous}px,0)`;
  }
}

export default ParallaxItem;
