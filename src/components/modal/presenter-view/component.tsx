import * as React from 'react';
import { RESET_DATA_CHANNEL } from 'bigbluebutton-html-plugin-sdk';
import { DataChannelEntryResponseType } from 'bigbluebutton-html-plugin-sdk/dist/cjs/data-channel/types';
import { defineMessages } from 'react-intl';

import * as Styled from './styles';
import { PickedUser } from '../../pick-random-user/types';
import { PresenterViewComponentProps } from './types';
import { UserAvatar } from '../user-avatar/component';
import { useGetPickRandomUserFunction, useGetPossibleUsersToBePicked } from './hooks';
import { formatPickedTime } from './utils';

const intlMessages = defineMessages({
  filterChipsLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.filterChips.label',
    description: 'Label preceding the filter chip group',
    defaultMessage: 'Also include:',
  },
  moderatorsChipLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.filterChips.moderators',
    description: 'Chip label to include moderators',
    defaultMessage: 'Moderators',
  },
  presenterChipLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.filterChips.presenter',
    description: 'Chip label to include presenter',
    defaultMessage: 'Presenter',
  },
  pickedUsersChipLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.filterChips.pickedUsers',
    description: 'Chip label to include already picked users',
    defaultMessage: 'Already picked',
  },
  availableTitle: {
    id: 'pickRandomUserPlugin.modal.presenterView.availableSection.title',
    description: 'Title of the "available users" section on modal`s presenter view',
    defaultMessage: 'Available for selection',
  },
  userLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.availableSection.userLabel',
    description: 'Label to count user in "available users" section on presenter view',
    defaultMessage: 'user',
  },
  userLabelPlural: {
    id: 'pickRandomUserPlugin.modal.presenterView.availableSection.userLabelPlural',
    description: 'Label to count users in "available users" section on presenter view',
    defaultMessage: 'users',
  },
  viewerLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.availableSection.viewerLabel',
    description: 'Label to count viewer in "available users" section on presenter view',
    defaultMessage: 'viewer',
  },
  viewerLabelPlural: {
    id: 'pickRandomUserPlugin.modal.presenterView.availableSection.viewerLabelPlural',
    description: 'Label to count viewers in "available users" section on presenter view',
    defaultMessage: 'viewers',
  },
  previouslyPickedTitle: {
    id: 'pickRandomUserPlugin.modal.presenterView.previouslyPickedSection.title',
    description: 'Title of the "previously picked" section on presenter view',
    defaultMessage: 'Previously picked',
  },
  clearButtonLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.previouslyPickedSection.clearButtonLabel',
    description: 'Label of button to clear list of already picked users',
    defaultMessage: 'Clear All',
  },
  noUsersWarning: {
    id: 'pickRandomUserPlugin.modal.presenterView.previouslyPickedSection.noUsersWarning',
    description: 'Warning that there is no user to be picked',
    defaultMessage: 'No {0} available to randomly pick from',
  },
  pickButtonLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.previouslyPickedSection.pickButtonLabel.pickUser',
    description: 'Label of the button to pick another user',
    defaultMessage: 'Pick random user',
  },
  pickNextRandomUserButtonLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.previouslyPickedSection.pickButtonLabel.pickNext',
    description: 'Label of the button to pick next random user (when already picked users are included in pool)',
    defaultMessage: 'Pick next random user',
  },
  pickAnotherRandomUserButtonLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.previouslyPickedSection.pickButtonLabel.pickAnother',
    description: 'Label of the button to pick another random user (when already picked users are excluded)',
    defaultMessage: 'Pick another random user',
  },
  emptyState: {
    id: 'pickRandomUserPlugin.modal.presenterView.previouslyPickedSection.emptyState',
    description: 'Empty state text shown when no user has been picked yet',
    defaultMessage: 'No user selected yet',
  },
  availableEmptyState: {
    id: 'pickRandomUserPlugin.modal.presenterView.availableSection.emptyState',
    description: 'Empty state text shown when no user is available for selection',
    defaultMessage: 'No {0} available for selection',
  },
  moderatorRoleLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.roleLabel.moderator',
    description: 'Role badge label for moderators',
    defaultMessage: 'moderator',
  },
  presenterRoleLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.roleLabel.presenter',
    description: 'Role badge label for presenters',
    defaultMessage: 'presenter',
  },
});

function CheckboxSquare({ active }: { active: boolean }) {
  const style: React.CSSProperties = active ? {
    width: '0.875rem',
    height: '0.875rem',
    borderRadius: '3px',
    background: '#4E7FF8',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } : {
    width: '0.875rem',
    height: '0.875rem',
    borderRadius: '3px',
    background: '#fff',
    border: '1.5px solid #C0C8D4',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };
  return (
    <span style={style}>
      {active && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </span>
  );
}

function makePickedUserRows(list?: DataChannelEntryResponseType<PickedUser>[]) {
  return list?.filter((u) => !!u.payloadJson).map((u) => (
    <Styled.PickedUserRow key={`${u.payloadJson.userId}-${new Date(u.createdAt).getTime()}`}>
      <UserAvatar user={u.payloadJson} size="small" />
      <Styled.UserNameText>{u.payloadJson.name}</Styled.UserNameText>
      <Styled.PickedTimeText>{formatPickedTime(u.createdAt)}</Styled.PickedTimeText>
    </Styled.PickedUserRow>
  ));
}

export function PresenterViewComponent(props: PresenterViewComponentProps) {
  const {
    intl,
    deletionFunction,
    dataChannelPickedUsers,
    pickedUserWithEntryId,
    pluginApi,
    filterOptions,
    setFilterOptions,
  } = props;

  const {
    includeModerators,
    includePresenter,
    includePickedUsers,
  } = filterOptions;

  const usersToBePicked = useGetPossibleUsersToBePicked(pluginApi, filterOptions);

  const handlePickRandomUser = useGetPickRandomUserFunction(pluginApi, usersToBePicked);

  const usersCount = usersToBePicked?.length ?? 0;
  const userRoleLabel = (() => {
    if (!includeModerators) {
      return usersCount !== 1
        ? intl.formatMessage(intlMessages.viewerLabelPlural, { 0: usersCount })
        : intl.formatMessage(intlMessages.viewerLabel, { 0: usersCount });
    }
    return usersCount !== 1
      ? intl.formatMessage(intlMessages.userLabelPlural, { 0: usersCount })
      : intl.formatMessage(intlMessages.userLabel, { 0: usersCount });
  })();

  const hasPickedUsers = dataChannelPickedUsers?.some((u) => !!u.payloadJson);

  return (
    <Styled.PresenterViewWrapper>
      <Styled.ContentPadding>

        {/* FILTER CHIPS */}
        <Styled.OptionsSection>
          <Styled.FilterRow>
            <Styled.FilterLabel>
              {intl.formatMessage(intlMessages.filterChipsLabel)}
            </Styled.FilterLabel>
            <Styled.ChipGroup>
              <Styled.FilterChip
                $active={includeModerators}
                htmlFor="includeModerators"
                data-test="includeModeratorsChip"
              >
                <Styled.ChipInput
                  id="includeModerators"
                  type="checkbox"
                  checked={includeModerators}
                  onChange={() => setFilterOptions((prev) => ({
                    ...prev, includeModerators: !prev.includeModerators,
                  }))}
                />
                <CheckboxSquare active={includeModerators} />
                {intl.formatMessage(intlMessages.moderatorsChipLabel)}
              </Styled.FilterChip>

              <Styled.FilterChip
                $active={includePresenter}
                htmlFor="includePresenter"
                data-test="includePresenterChip"
              >
                <Styled.ChipInput
                  id="includePresenter"
                  type="checkbox"
                  checked={includePresenter}
                  onChange={() => setFilterOptions((prev) => ({
                    ...prev, includePresenter: !prev.includePresenter,
                  }))}
                />
                <CheckboxSquare active={includePresenter} />
                {intl.formatMessage(intlMessages.presenterChipLabel)}
              </Styled.FilterChip>

              <Styled.FilterChip
                $active={includePickedUsers}
                htmlFor="includePickedUsers"
                data-test="includePickedUsersChip"
              >
                <Styled.ChipInput
                  id="includePickedUsers"
                  type="checkbox"
                  checked={includePickedUsers}
                  onChange={() => setFilterOptions((prev) => ({
                    ...prev, includePickedUsers: !prev.includePickedUsers,
                  }))}
                />
                <CheckboxSquare active={includePickedUsers} />
                {intl.formatMessage(intlMessages.pickedUsersChipLabel)}
              </Styled.FilterChip>
            </Styled.ChipGroup>
          </Styled.FilterRow>
        </Styled.OptionsSection>

        {/* AVAILABLE USERS SECTION */}
        <Styled.AvailableSection>
          <Styled.SectionHeaderRow data-test="pickRandomUserAvailableContent">
            <Styled.SectionLabel>
              {intl.formatMessage(intlMessages.availableTitle)}
            </Styled.SectionLabel>
            <Styled.CountBadge>
              {usersCount}
              {' '}
              {userRoleLabel}
            </Styled.CountBadge>
          </Styled.SectionHeaderRow>
          {usersCount === 0 ? (
            <Styled.EmptyStateContainer>
              <Styled.EmptyStateText>
                {intl.formatMessage(intlMessages.availableEmptyState, { 0: userRoleLabel })}
              </Styled.EmptyStateText>
            </Styled.EmptyStateContainer>
          ) : (
            <Styled.UserListContainer>
              {usersToBePicked?.map((user) => {
                let roleBadgeLabel: string | null = null;
                if (user.role === 'MODERATOR') {
                  roleBadgeLabel = intl.formatMessage(intlMessages.moderatorRoleLabel);
                } else if (user.presenter) {
                  roleBadgeLabel = intl.formatMessage(intlMessages.presenterRoleLabel);
                }
                return (
                  <Styled.UserRow key={user.userId}>
                    <UserAvatar user={user} size="small" />
                    <Styled.UserNameText>{user.name}</Styled.UserNameText>
                    {roleBadgeLabel && (
                      <Styled.RoleBadge>{roleBadgeLabel}</Styled.RoleBadge>
                    )}
                  </Styled.UserRow>
                );
              })}
            </Styled.UserListContainer>
          )}
        </Styled.AvailableSection>

        {/* PREVIOUSLY PICKED SECTION */}
        <Styled.PreviouslyPickedSection>
          <Styled.SectionHeaderRow>
            <Styled.SectionLabel>
              {intl.formatMessage(intlMessages.previouslyPickedTitle)}
            </Styled.SectionLabel>
            <Styled.ClearAllButton
              type="button"
              data-test="pickRandomUserClearAllButton"
              onClick={() => deletionFunction([RESET_DATA_CHANNEL])}
            >
              {intl.formatMessage(intlMessages.clearButtonLabel)}
            </Styled.ClearAllButton>
          </Styled.SectionHeaderRow>
          {hasPickedUsers ? (
            <Styled.PickedUserListContainer>
              <Styled.PickedList data-test="pickRandomUserPreviouslyPickedList">
                {makePickedUserRows(dataChannelPickedUsers)}
              </Styled.PickedList>
            </Styled.PickedUserListContainer>
          ) : (
            <>
              <Styled.EmptyStateContainer>
                <Styled.EmptyStateText>
                  {intl.formatMessage(intlMessages.emptyState)}
                </Styled.EmptyStateText>
              </Styled.EmptyStateContainer>
              {/* Empty list kept in DOM so [data-test] li selectors resolve correctly */}
              <Styled.PickedList data-test="pickRandomUserPreviouslyPickedList" />
            </>
          )}
        </Styled.PreviouslyPickedSection>

      </Styled.ContentPadding>

      {/* FOOTER */}
      <Styled.FooterContainer>
        {usersCount > 0 ? (
          <Styled.PickButton
            type="button"
            data-test="pickRandomUserPickButton"
            onClick={handlePickRandomUser}
          >
            {pickedUserWithEntryId
              ? intl.formatMessage(includePickedUsers
                ? intlMessages.pickNextRandomUserButtonLabel
                : intlMessages.pickAnotherRandomUserButtonLabel)
              : intl.formatMessage(intlMessages.pickButtonLabel)}
          </Styled.PickButton>
        ) : (
          <Styled.NoUsersWarning data-test="pickRandomUserNoUsersWarning">
            {intl.formatMessage(intlMessages.noUsersWarning, { 0: userRoleLabel })}
          </Styled.NoUsersWarning>
        )}
      </Styled.FooterContainer>
    </Styled.PresenterViewWrapper>
  );
}
