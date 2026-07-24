import * as React from 'react';
import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render } from '@testing-library/react';
import { createIntl } from 'react-intl';
import { PickUserModal } from '../../src/components/modal/component';
import { PickedUser, PickedUserWithEntryId } from '../../src/components/pick-random-user/types';

// The component tree under test pulls in RESET_DATA_CHANNEL and pluginLogger (values)
// from the SDK. Stub them so the debug instrumentation does not reach the real logging
// pipeline; every other SDK import used here is type-only and is erased at build time.
vi.mock('bigbluebutton-html-plugin-sdk', () => ({
  RESET_DATA_CHANNEL: 'RESET_DATA_CHANNEL',
  DataChannelTypes: { LATEST_ITEM: 'Hooks::DataChannel::LatestItem' },
  pluginLogger: {
    debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(),
  },
}));

// `styles.tsx` wraps react-modal with styled-components (`styled(ReactModal)`), which
// relies on a CJS/ESM interop shape that only holds up under the real webpack build,
// not vitest's esbuild-based transform. This test is about the presenter/modal-open
// subscription gating in component.tsx, not react-modal's portal behaviour, so replace
// the styled wrappers with plain passthroughs that respect `isOpen`.
vi.mock('../../src/components/modal/styles', () => ({
  PluginModal: ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => (
    isOpen ? <div data-test="mock-plugin-modal">{children}</div> : null
  ),
  ModalHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ModalTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CloseButton: ({ children, ...rest }: React.ComponentPropsWithoutRef<'button'>) => (
    <button type="button" {...rest}>{children}</button>
  ),
  ModalWithToastWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FloatingToast: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const intl = createIntl({ locale: 'en', messages: {} });

const graphqlWrapper = <T, >(data: T) => ({ loading: false, data, error: undefined });

const pickedUser = (userId: string): PickedUser => ({
  userId, name: userId, role: 'MODERATOR', presenter: false, bot: false, avatar: '', color: '#000',
});

// A pluginApi whose useUsersBasicInfo reports every subscribe/unsubscribe through the
// given spies, mirroring how a real GraphQL subscription hook ties its lifecycle to the
// mount/unmount of whichever component calls it.
function makePluginApi(onSubscribe: () => void, onUnsubscribe: () => void) {
  return {
    useUsersBasicInfo: () => {
      React.useEffect(() => {
        onSubscribe();
        return () => onUnsubscribe();
      }, []);
      return graphqlWrapper({ user: [] });
    },
    useDataChannel: () => ({
      data: graphqlWrapper([]),
      pushEntry: vi.fn(),
      deleteEntry: vi.fn(),
    }),
    useCurrentUser: () => ({ data: { userId: 'presenter-1', presenter: true } }),
  } as never;
}

const baseModalProps = {
  uuid: 'test-uuid',
  intl,
  pickRandomUserSettings: {
    pingSoundEnabled: false,
    pingSoundUrl: '',
    browserNotificationEnabled: false,
    pickedUserTimeWindow: 30,
    preventCloseDelaySeconds: 0,
  },
  handleCloseModal: vi.fn(),
  dataChannelPickedUsers: undefined,
  deletionFunction: vi.fn(),
  pickedUserSeenEntries: graphqlWrapper([]),
  pushPickedUserSeen: vi.fn(),
};

describe('presenter-view data subscription lifecycle (unstable connection follow-up)', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="modals-container"></div>';
  });

  it('never subscribes when the current user is not the presenter, even with the modal open', () => {
    const onSubscribe = vi.fn();
    const onUnsubscribe = vi.fn();

    render(
      <PickUserModal
        {...baseModalProps}
        pluginApi={makePluginApi(onSubscribe, onUnsubscribe)}
        showModal
        currentUser={{ userId: 'viewer-1', presenter: false } as never}
        currentPickedUser={{
          pickedUser: pickedUser('viewer-1'), entryId: 'entry-1',
        } as PickedUserWithEntryId}
      />,
    );

    expect(onSubscribe).not.toHaveBeenCalled();
  });

  it('never subscribes for the presenter while the modal is closed', () => {
    const onSubscribe = vi.fn();
    const onUnsubscribe = vi.fn();

    render(
      <PickUserModal
        {...baseModalProps}
        pluginApi={makePluginApi(onSubscribe, onUnsubscribe)}
        showModal={false}
        currentUser={{ userId: 'presenter-1', presenter: true } as never}
        currentPickedUser={null}
      />,
    );

    expect(onSubscribe).not.toHaveBeenCalled();
  });

  it('subscribes exactly once when the presenter has the modal open, and does not re-subscribe across a pick', () => {
    const onSubscribe = vi.fn();
    const onUnsubscribe = vi.fn();
    const pluginApi = makePluginApi(onSubscribe, onUnsubscribe);
    const currentUser = { userId: 'presenter-1', presenter: true } as never;

    const { rerender } = render(
      <PickUserModal
        {...baseModalProps}
        pluginApi={pluginApi}
        showModal
        currentUser={currentUser}
        currentPickedUser={null}
      />,
    );

    expect(onSubscribe).toHaveBeenCalledTimes(1);
    expect(onUnsubscribe).not.toHaveBeenCalled();

    // The presenter picks someone: the modal internally swaps from the presenter view to
    // the picked-user view. Before the fix, this unmounted/remounted the component that
    // owned the subscription, causing a fresh loading state on every pick.
    rerender(
      <PickUserModal
        {...baseModalProps}
        pluginApi={pluginApi}
        showModal
        currentUser={currentUser}
        currentPickedUser={{
          pickedUser: pickedUser('attendee-1'), entryId: 'entry-1',
        } as PickedUserWithEntryId}
      />,
    );

    expect(onSubscribe).toHaveBeenCalledTimes(1);
    expect(onUnsubscribe).not.toHaveBeenCalled();

    // Back to the presenter view (e.g. the presenter clicked "back" / picked again) -
    // still the same, uninterrupted subscription.
    rerender(
      <PickUserModal
        {...baseModalProps}
        pluginApi={pluginApi}
        showModal
        currentUser={currentUser}
        currentPickedUser={null}
      />,
    );

    expect(onSubscribe).toHaveBeenCalledTimes(1);
    expect(onUnsubscribe).not.toHaveBeenCalled();
  });

  it('tears the subscription down once the modal is closed', () => {
    const onSubscribe = vi.fn();
    const onUnsubscribe = vi.fn();
    const pluginApi = makePluginApi(onSubscribe, onUnsubscribe);
    const currentUser = { userId: 'presenter-1', presenter: true } as never;

    const { rerender } = render(
      <PickUserModal
        {...baseModalProps}
        pluginApi={pluginApi}
        showModal
        currentUser={currentUser}
        currentPickedUser={null}
      />,
    );

    expect(onSubscribe).toHaveBeenCalledTimes(1);
    expect(onUnsubscribe).not.toHaveBeenCalled();

    rerender(
      <PickUserModal
        {...baseModalProps}
        pluginApi={pluginApi}
        showModal={false}
        currentUser={currentUser}
        currentPickedUser={null}
      />,
    );

    expect(onUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
