import * as React from 'react';
import { RESET_DATA_CHANNEL } from 'bigbluebutton-html-plugin-sdk';
import { DataChannelEntryResponseType } from 'bigbluebutton-html-plugin-sdk/dist/cjs/data-channel/types';
import { defineMessages } from 'react-intl';

import * as Styled from './styles';
import { PickedUser } from '../../pick-random-user/types';
import { PresenterViewComponentProps } from './types';

const intlMessages = defineMessages({
  optionsTitle: {
    id: 'pickRandomUserPlugin.modal.presenterView.optionSection.title',
    description: 'Title of the options section on modal`s presenter view',
    defaultMessage: 'Options',
  },
  skipModeratorsLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.optionSection.skipModeratorsLabel',
    description: 'Label of skip moderator`s option on modal`s presenter view',
    defaultMessage: 'Skip moderators',
  },
  skipPresenterLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.optionSection.skipPresenterLabel',
    description: 'Label of skip presenter`s option on modal`s presenter view',
    defaultMessage: 'Skip presenter',
  },
  includePickedUsersLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.optionSection.includePickedUsersLabel',
    description: 'Label of include picked users option on modal`s presenter view',
    defaultMessage: 'Include already picked user',
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
    defaultMessage: 'Pick {0}',
  },
  pickAgainButtonLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.previouslyPickedSection.pickButtonLabel.pickAgain',
    description: 'Label of the button to pick another user',
    defaultMessage: 'Pick again',
  },
});

const MAX_NAMES_TO_SHOW = 3;

const makeHorizontalListOfNames = (list?: PickedUser[]) => {
  const length = list?.length;
  const formattedList = list?.filter((_, index) => {
    if (length > MAX_NAMES_TO_SHOW) return index < MAX_NAMES_TO_SHOW;
    return true;
  }).reduce((accumulator, currentValue) => ((accumulator !== '') ? `${accumulator}, ${currentValue.name}` : currentValue.name), '');
  if (length > MAX_NAMES_TO_SHOW) return `${formattedList}...`;
  return formattedList;
};

const makeVerticalListOfNames = (
  list?: DataChannelEntryResponseType<PickedUser>[],
) => list?.filter((u) => !!u.payloadJson).map((u) => {
  const time = new Date(u.createdAt);
  const timeMiliseconds = time.getTime();
  return (
    <li key={`${u.payloadJson.userId}-${timeMiliseconds}`}>
      {u.payloadJson.name}
      {' '}
      (
      {time.getHours().toString().padStart(2, '0')}
      :
      {time.getMinutes().toString().padStart(2, '0')}
      )
    </li>
  );
});

export function PresenterViewComponent(props: PresenterViewComponentProps) {
  const {
    intl,
    filterOutPresenter,
    setFilterOutPresenter,
    userFilterViewer,
    setUserFilterViewer,
    filterOutPickedUsers,
    setFilterOutPickedUsers,
    deletionFunction,
    handlePickRandomUser,
    dataChannelPickedUsers,
    pickedUserWithEntryId,
    users,
  } = props;

  let userRoleLabel: string;
  const usersCountVariable = { 0: users?.length };
  if (userFilterViewer) {
    userRoleLabel = (users?.length !== 1)
      ? intl.formatMessage(intlMessages.viewerLabelPlural, usersCountVariable)
      : intl.formatMessage(intlMessages.viewerLabel, usersCountVariable);
  } else {
    userRoleLabel = (users?.length !== 1)
      ? intl.formatMessage(intlMessages.userLabelPlural, usersCountVariable)
      : intl.formatMessage(intlMessages.userLabel, usersCountVariable);
  }
  return (
    <Styled.PresenterViewContentWrapper>
      <Styled.PresenterViewSectionWrapper>
        <Styled.PresenterViewSectionTitle>
          {intl.formatMessage(intlMessages.optionsTitle)}
        </Styled.PresenterViewSectionTitle>
        <Styled.PresenterViewSectionContent>
          <Styled.CheckboxLabelWrapper htmlFor="skipModerators">
            <input
              type="checkbox"
              id="skipModerators"
              checked={userFilterViewer}
              onChange={() => {
                setUserFilterViewer(!userFilterViewer);
              }}
              name="options"
              value="skipModerators"
            />
            <Styled.CheckboxLabel>
              {intl.formatMessage(intlMessages.skipModeratorsLabel)}
            </Styled.CheckboxLabel>
          </Styled.CheckboxLabelWrapper>
          <Styled.CheckboxLabelWrapper htmlFor="skipPresenter">
            <input
              type="checkbox"
              id="skipPresenter"
              checked={filterOutPresenter}
              onChange={() => {
                setFilterOutPresenter(!filterOutPresenter);
              }}
              name="options"
              value="skipPresenter"
            />
            <Styled.CheckboxLabel>
              {intl.formatMessage(intlMessages.skipPresenterLabel)}
            </Styled.CheckboxLabel>
          </Styled.CheckboxLabelWrapper>
          <Styled.CheckboxLabelWrapper htmlFor="includePickedUsers">
            <input
              type="checkbox"
              id="includePickedUsers"
              checked={!filterOutPickedUsers}
              onChange={() => {
                setFilterOutPickedUsers(!filterOutPickedUsers);
              }}
              name="options"
              value="includePickedUsers"
            />
            <Styled.CheckboxLabel>
              {intl.formatMessage(intlMessages.includePickedUsersLabel)}
            </Styled.CheckboxLabel>
          </Styled.CheckboxLabelWrapper>
        </Styled.PresenterViewSectionContent>
      </Styled.PresenterViewSectionWrapper>
      <Styled.PresenterViewSectionWrapper>
        <Styled.PresenterViewSectionTitle>
          {intl.formatMessage(intlMessages.availableTitle)}
        </Styled.PresenterViewSectionTitle>
        <Styled.PresenterViewSectionContent>
          {`${users?.length} ${userRoleLabel}: `}
          {makeHorizontalListOfNames(users)}
        </Styled.PresenterViewSectionContent>
      </Styled.PresenterViewSectionWrapper>
      <Styled.PresenterViewSectionWrapper>
        <Styled.PresenterViewSectionTitleWrapper>
          <Styled.PresenterViewSectionTitle>
            {intl.formatMessage(intlMessages.previouslyPickedTitle)}
          </Styled.PresenterViewSectionTitle>
          <Styled.PresenterViewSectionClearAllButton
            type="button"
            onClick={() => {
              deletionFunction([RESET_DATA_CHANNEL]);
            }}
          >
            {intl.formatMessage(intlMessages.clearButtonLabel)}
          </Styled.PresenterViewSectionClearAllButton>
        </Styled.PresenterViewSectionTitleWrapper>
        <Styled.PresenterViewSectionListWrapper>
          <Styled.PresenterViewSectionList>
            {
              makeVerticalListOfNames(dataChannelPickedUsers)
            }
          </Styled.PresenterViewSectionList>
        </Styled.PresenterViewSectionListWrapper>
      </Styled.PresenterViewSectionWrapper>
      {
        users?.length > 0 ? (
          <Styled.PickUserButton
            type="button"
            onClick={() => {
              handlePickRandomUser();
            }}
          >
            {
            (pickedUserWithEntryId)
              ? intl.formatMessage(intlMessages.pickAgainButtonLabel)
              : intl.formatMessage(intlMessages.pickButtonLabel, { 0: userRoleLabel })
            }
          </Styled.PickUserButton>
        ) : (
          <p>
            {intl.formatMessage(intlMessages.noUsersWarning, { 0: userRoleLabel })}
          </p>
        )
      }
    </Styled.PresenterViewContentWrapper>
  );
}
