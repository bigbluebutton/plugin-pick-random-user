import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';
import { act, renderHook } from '@testing-library/react';

vi.mock('bigbluebutton-html-plugin-sdk', () => ({
  pluginLogger: {
    warn: vi.fn(), info: vi.fn(), error: vi.fn(), debug: vi.fn(),
  },
  DataChannelTypes: { LATEST_ITEM: 'LATEST_ITEM' },
}));

// eslint-disable-next-line import/first
import { usePreventCloseModalCountdown } from '../../src/components/modal/hooks';

const currentUser = { userId: 'u1' } as never;
const notSeen = { data: [], loading: false } as never;
const pickedUser = { entryId: 'e1', pickedUser: { userId: 'p1' } } as never;
const settings = (preventCloseDelaySeconds: number) => ({ preventCloseDelaySeconds } as never);

describe('usePreventCloseModalCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('blocks closing while the countdown runs and allows it once elapsed', () => {
    const { result } = renderHook(
      () => usePreventCloseModalCountdown(currentUser, notSeen, pickedUser, settings(3)),
    );

    expect(result.current.canClose).toBe(false);
    expect(result.current.remainingSeconds).toBe(3);

    act(() => {
      vi.advanceTimersByTime(3500);
    });

    expect(result.current.canClose).toBe(true);
    expect(result.current.remainingSeconds).toBe(0);
  });

  it('does not block closing when the delay is zero', () => {
    const { result } = renderHook(
      () => usePreventCloseModalCountdown(currentUser, notSeen, pickedUser, settings(0)),
    );

    expect(result.current.canClose).toBe(true);
    expect(result.current.remainingSeconds).toBe(0);
  });

  it('allows closing when there is no picked user', () => {
    const { result } = renderHook(
      () => usePreventCloseModalCountdown(currentUser, notSeen, null, settings(3)),
    );

    expect(result.current.canClose).toBe(true);
  });
});
