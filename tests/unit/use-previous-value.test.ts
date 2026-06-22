import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePreviousValue } from '../../src/commons/hooks';

describe('usePreviousValue', () => {
  it('returns undefined on the first render', () => {
    const { result } = renderHook(() => usePreviousValue('first'));
    expect(result.current).toBeUndefined();
  });

  it('returns the value from the previous render after an update', () => {
    const { result, rerender } = renderHook(({ value }) => usePreviousValue(value), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    expect(result.current).toBe('a');

    rerender({ value: 'c' });
    expect(result.current).toBe('b');
  });
});
