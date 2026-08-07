import '@testing-library/jest-dom';

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

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
