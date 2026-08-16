import '@testing-library/jest-dom';

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

class MockIntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];

  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
}

if (typeof window !== 'undefined') {
  window.IntersectionObserver = MockIntersectionObserver;
  window.matchMedia = window.matchMedia || ((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock canvas getContext for JSDOM testing
if (typeof window !== 'undefined' && window.HTMLCanvasElement) {
  window.HTMLCanvasElement.prototype.getContext = function () {
    return {
      clearRect: function () {},
      beginPath: function () {},
      arc: function () {},
      fill: function () {},
      moveTo: function () {},
      lineTo: function () {},
      stroke: function () {},
    };
  };
}
