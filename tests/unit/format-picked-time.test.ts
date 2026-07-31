import { describe, it, expect } from 'vitest';
import { formatPickedTime } from '../../src/components/modal/presenter-view/utils';

// Dates are built from local components so the assertions are timezone-independent.
describe('formatPickedTime', () => {
  it('zero-pads single-digit hours and minutes', () => {
    expect(formatPickedTime(new Date(2024, 0, 1, 9, 5))).toBe('09:05');
  });

  it('formats afternoon times in 24h notation', () => {
    expect(formatPickedTime(new Date(2024, 0, 1, 14, 30))).toBe('14:30');
  });

  it('handles midnight', () => {
    expect(formatPickedTime(new Date(2024, 0, 1, 0, 0))).toBe('00:00');
  });

  it('accepts a numeric timestamp', () => {
    const ts = new Date(2024, 0, 1, 7, 8).getTime();
    expect(formatPickedTime(ts)).toBe('07:08');
  });
});
