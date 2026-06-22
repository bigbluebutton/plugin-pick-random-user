import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGetCurrentPickedUser } from '../../src/components/pick-random-user/hooks';

const entry = (entryId: string, userId: string) => ({
  entryId,
  payloadJson: { userId, name: userId },
});

describe('useGetCurrentPickedUser', () => {
  it('returns null when there is no data-channel data', () => {
    const { result } = renderHook(
      ({ dc }) => useGetCurrentPickedUser(dc),
      { initialProps: { dc: undefined as never } },
    );
    expect(result.current).toBeNull();
  });

  it('returns the first entry as the current picked user', () => {
    const { result } = renderHook(
      ({ dc }) => useGetCurrentPickedUser(dc),
      { initialProps: { dc: [entry('e1', 'p1')] as never } },
    );
    expect(result.current).toEqual({
      entryId: 'e1',
      pickedUser: { userId: 'p1', name: 'p1' },
    });
  });

  it('updates when the entryId changes and clears when the list empties', () => {
    const { result, rerender } = renderHook(
      ({ dc }) => useGetCurrentPickedUser(dc),
      { initialProps: { dc: [entry('e1', 'p1')] as never } },
    );
    expect(result.current?.entryId).toBe('e1');

    rerender({ dc: [entry('e2', 'p2')] as never });
    expect(result.current?.entryId).toBe('e2');
    expect(result.current?.pickedUser.userId).toBe('p2');

    rerender({ dc: [] as never });
    expect(result.current).toBeNull();
  });
});
