import './style.css';
import Lenis from '@studio-freight/lenis';
import ParallaxItem from './ParallaxItem';
import imagesLoaded from 'imagesloaded';

let docScroll;
const items = [];

const getPageYScroll = () =>
  (docScroll = window.pageYOffset || document.documentElement.scrollTop);
getPageYScroll();

const doSomething = (progress) => {
  getPageYScroll();
  items.forEach((item, i) => {
    item.docScroll = docScroll;
    if (item.isVisible) {
      if (item.insideViewport) {
        item.render();
      } else {
        item.insideViewport = true;
        item.update();
      }
    } else {
      item.insideViewport = false;
    }
  });
};

const scrollNoLibrary = () => {
  getPageYScroll();
  items.forEach((item, i) => {
    item.docScroll = docScroll;
    if (item.isVisible) {
      if (item.insideViewport) {
        item.render();
      } else {
        item.insideViewport = true;
        item.update();
      }
    } else {
      item.insideViewport = false;
    }
  });
};

// const lenis = new Lenis({
//   duration: 0.1,
//   // easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
//   direction: 'vertical', // vertical, horizontal
//   gestureDirection: 'vertical', // vertical, horizontal, both
//   smooth: true,
//   mouseMultiplier: 1,
//   smoothTouch: false,
//   touchMultiplier: 2,
//   infinite: false,
// });

// //get scroll value
// lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
//   console.log(scroll);
//   doSomething(progress);
// });

// function raf(time) {
//   lenis.raf(time);
//   requestAnimationFrame(raf);
// }

// requestAnimationFrame(raf);

/***********************************/
/********** Preload stuff **********/

// Preload images
const preloadImages = () => {
  return new Promise((resolve, reject) => {
    imagesLoaded(
      document.querySelectorAll('.content__item-img'),
      { background: true },
      resolve
    );
  });
};

// And then..
preloadImages().then(() => {
  document.body.classList.remove('loading');
  const slides = document.querySelectorAll('.content__item');
  slides.forEach((slide) => items.push(new ParallaxItem(slide)));
  items.forEach((item) => (item.docScroll = docScroll));
  window.addEventListener('scroll', () => {
    requestAnimationFrame(scrollNoLibrary);
  });
});
