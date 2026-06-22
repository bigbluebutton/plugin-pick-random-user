import { describe, it, expect } from 'vitest';
import { hasCurrentUserSeenPickedUser, isNumber } from '../../src/commons/utils';

const wrap = (data: unknown) => ({ data } as never);
const seenEntry = (seenByUserId: string, pickedUserId: string) => ({
  payloadJson: { seenByUserId, pickedUserId },
});

describe('isNumber', () => {
  it('returns true for finite numbers, including zero and negatives', () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber(10)).toBe(true);
    expect(isNumber(-3)).toBe(true);
    expect(isNumber(3.14)).toBe(true);
  });

  it('returns false for NaN', () => {
    expect(isNumber(NaN)).toBe(false);
  });

  it('returns false for non-number types', () => {
    expect(isNumber('5')).toBe(false);
    expect(isNumber('abc')).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(isNumber([])).toBe(false);
    expect(isNumber(true)).toBe(false);
  });
});

describe('hasCurrentUserSeenPickedUser', () => {
  it('returns false when there are no entries', () => {
    expect(hasCurrentUserSeenPickedUser(wrap([]), 'u1', 'p1')).toBe(false);
    expect(hasCurrentUserSeenPickedUser(wrap(undefined), 'u1', 'p1')).toBe(false);
    expect(hasCurrentUserSeenPickedUser(undefined as never, 'u1', 'p1')).toBe(false);
  });

  it('returns true when the current user has seen the picked user', () => {
    expect(hasCurrentUserSeenPickedUser(wrap([seenEntry('u1', 'p1')]), 'u1', 'p1')).toBe(true);
  });

  it('returns false when seenByUserId belongs to another user', () => {
    expect(hasCurrentUserSeenPickedUser(wrap([seenEntry('u2', 'p1')]), 'u1', 'p1')).toBe(false);
  });

  it('returns false when the entry refers to a different picked user', () => {
    expect(hasCurrentUserSeenPickedUser(wrap([seenEntry('u1', 'p2')]), 'u1', 'p1')).toBe(false);
  });

  it('finds a matching entry among several', () => {
    const entries = [seenEntry('u2', 'p1'), seenEntry('u1', 'p1')];
    expect(hasCurrentUserSeenPickedUser(wrap(entries), 'u1', 'p1')).toBe(true);
  });

  it('ignores entries without payloadJson', () => {
    expect(hasCurrentUserSeenPickedUser(wrap([{ payloadJson: null }]), 'u1', 'p1')).toBe(false);
  });
});
