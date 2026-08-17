/**
 * Tactile / Vibration Feedback Utility (Progressive Enhancement)
 * 
 * Uses the Web Vibration API (navigator.vibrate) when available on supported devices.
 * MDN Reference: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate
 * 
 * MUST be used sparingly for high-confidence actions only:
 * - Stage / pipeline changes
 * - Task completions
 * - Call outcome saves
 * - Destructive action warnings
 */

export function provideTactileFeedback(pattern: number | number[] = 15): void {
  if (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    typeof navigator.vibrate === 'function'
  ) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore silence on unsupported or restricted environments
    }
  }
}

/**
 * Standard tactile feedback presets for specific user actions
 */
export const Haptics = {
  /** Light pulse for action confirmations (e.g., date selection) */
  confirm: () => provideTactileFeedback(12),
  
  /** Success pattern for completed tasks, saved call notes, stage moves */
  success: () => provideTactileFeedback([15, 40, 20]),
  
  /** Warning pattern for destructive/suppression actions */
  warning: () => provideTactileFeedback([30, 50, 30]),
};
