import { describe, it, expect } from 'vitest';
import { filterPossibleUsersToBePicked } from '../../src/components/modal/presenter-view/utils';
import { FilterOptionsType } from '../../src/components/modal/types';

interface TestUser {
  userId: string;
  name: string;
  role: string;
  presenter: boolean;
  bot: boolean;
}

const user = (over: Partial<TestUser>): TestUser => ({
  userId: 'x',
  name: 'X',
  role: 'VIEWER',
  presenter: false,
  bot: false,
  ...over,
});

const filters = (over: Partial<FilterOptionsType> = {}): FilterOptionsType => ({
  includeModerators: false,
  includePresenter: false,
  includePickedUsers: false,
  ...over,
});

const viewer = user({ userId: 'v1', name: 'Viewer 1' });
const moderator = user({ userId: 'm1', name: 'Mod 1', role: 'MODERATOR' });
const viewerPresenter = user({ userId: 'p1', name: 'Viewer Presenter', presenter: true });
const botUser = user({ userId: 'b1', name: 'Bot', bot: true });
const alreadyPicked = user({ userId: 'v2', name: 'Viewer 2' });

const allUsers = {
  user: [viewer, moderator, viewerPresenter, botUser, alreadyPicked],
} as never;

const pickedFromDataChannel = [{ payloadJson: { userId: 'v2' } }] as never;

const idsOf = (result: { user: TestUser[] }) => result.user.map((u) => u.userId).sort();

describe('filterPossibleUsersToBePicked', () => {
  it('with all filters off keeps only non-bot, non-presenter, not-yet-picked viewers', () => {
    const result = filterPossibleUsersToBePicked(allUsers, pickedFromDataChannel, filters());
    expect(idsOf(result as never)).toEqual(['v1']);
  });

  it('always excludes bots, regardless of filters', () => {
    const result = filterPossibleUsersToBePicked(
      allUsers,
      pickedFromDataChannel,
      filters({ includeModerators: true, includePresenter: true, includePickedUsers: true }),
    );
    expect((result as { user: TestUser[] }).user.every((u) => !u.bot)).toBe(true);
  });

  it('includes moderators when includeModerators is on', () => {
    const result = filterPossibleUsersToBePicked(
      allUsers,
      pickedFromDataChannel,
      filters({ includeModerators: true }),
    );
    expect(idsOf(result as never)).toEqual(['m1', 'v1']);
  });

  it('includes the presenter when includePresenter is on', () => {
    const result = filterPossibleUsersToBePicked(
      allUsers,
      pickedFromDataChannel,
      filters({ includePresenter: true }),
    );
    expect(idsOf(result as never)).toEqual(['p1', 'v1']);
  });

  it('includes already-picked users when includePickedUsers is on', () => {
    const result = filterPossibleUsersToBePicked(
      allUsers,
      pickedFromDataChannel,
      filters({ includePickedUsers: true }),
    );
    expect(idsOf(result as never)).toEqual(['v1', 'v2']);
  });

  it('with every filter on keeps all non-bot users', () => {
    const result = filterPossibleUsersToBePicked(
      allUsers,
      pickedFromDataChannel,
      filters({ includeModerators: true, includePresenter: true, includePickedUsers: true }),
    );
    expect(idsOf(result as never)).toEqual(['m1', 'p1', 'v1', 'v2']);
  });

  it('keeps every viewer when the picked list is empty', () => {
    const result = filterPossibleUsersToBePicked(allUsers, [] as never, filters());
    expect(idsOf(result as never)).toEqual(['v1', 'v2']);
  });

  it('returns an empty list when there are no users', () => {
    const result = filterPossibleUsersToBePicked(undefined, pickedFromDataChannel, filters());
    expect((result as { user: TestUser[] }).user).toEqual([]);
  });
});
