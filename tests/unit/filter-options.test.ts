import {
  describe, it, expect, vi,
} from 'vitest';

// modal/hooks.ts transitively imports the plugin SDK (pluginLogger, DataChannelTypes)
// as runtime values. Stub them so the pure helpers can be imported in isolation.
vi.mock('bigbluebutton-html-plugin-sdk', () => ({
  pluginLogger: {
    warn: vi.fn(), info: vi.fn(), error: vi.fn(), debug: vi.fn(),
  },
  DataChannelTypes: { LATEST_ITEM: 'LATEST_ITEM' },
}));

// eslint-disable-next-line import/first
import {
  hasFilterOptionsChanged,
  getLatestFilterOptionsFromDataChannel,
} from '../../src/components/modal/hooks';
// eslint-disable-next-line import/first
import { FilterOptionsType } from '../../src/components/modal/types';

const opts = (over: Partial<FilterOptionsType> = {}): FilterOptionsType => ({
  includeModerators: false,
  includePresenter: false,
  includePickedUsers: false,
  ...over,
});

describe('hasFilterOptionsChanged', () => {
  it('returns false when all flags are equal', () => {
    expect(hasFilterOptionsChanged(opts(), opts())).toBe(false);
  });

  it('returns true when any flag differs', () => {
    expect(hasFilterOptionsChanged(opts(), opts({ includeModerators: true }))).toBe(true);
    expect(hasFilterOptionsChanged(opts(), opts({ includePresenter: true }))).toBe(true);
    expect(hasFilterOptionsChanged(opts(), opts({ includePickedUsers: true }))).toBe(true);
  });

  it('returns true when the data-channel value is missing', () => {
    expect(hasFilterOptionsChanged(opts(), undefined)).toBe(true);
  });
});

describe('getLatestFilterOptionsFromDataChannel', () => {
  it('returns null when there is no data', () => {
    expect(getLatestFilterOptionsFromDataChannel({ data: null } as never)).toBeNull();
  });

  it('returns undefined when the data list is empty', () => {
    expect(getLatestFilterOptionsFromDataChannel({ data: [] } as never)).toBeUndefined();
  });

  it('returns the payloadJson of the first entry', () => {
    const fo = opts({ includeModerators: true });
    expect(getLatestFilterOptionsFromDataChannel({ data: [{ payloadJson: fo }] } as never))
      .toEqual(fo);
  });
});
