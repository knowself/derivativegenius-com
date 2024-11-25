// Debug utility to control all instrumentation logging
const DEBUG = typeof window !== 'undefined' ? 
  window.localStorage.getItem('DEBUG_ENABLED') === 'true' : false;

export const debug = {
  log: (...args) => DEBUG && console.log('[Debug]', ...args),
  info: (...args) => DEBUG && console.info('[Info]', ...args),
  error: (...args) => DEBUG && console.error('[Error]', ...args),
  warn: (...args) => DEBUG && console.warn('[Warn]', ...args),
  group: (label) => DEBUG && console.group(label),
  groupEnd: () => DEBUG && console.groupEnd(),
  enabled: DEBUG
};

// Enable/disable debug logging at runtime
export const toggleDebug = (enable = true) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('DEBUG_ENABLED', enable);
    window.location.reload(); // Refresh to apply changes
  }
};

// Expose debug controls globally for easy console access
if (typeof window !== 'undefined') {
  window.enableDebug = () => toggleDebug(true);
  window.disableDebug = () => toggleDebug(false);
  window.isDebugEnabled = () => DEBUG;
}

export default debug;
