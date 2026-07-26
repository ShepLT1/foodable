import '@testing-library/jest-dom'

// jsdom lacks ResizeObserver, which Headless UI uses when opening overlays
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
