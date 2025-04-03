import * as React from 'react';
import { RESET_DATA_CHANNEL } from 'bigbluebutton-html-plugin-sdk';
import { DataChannelEntryResponseType } from 'bigbluebutton-html-plugin-sdk/dist/cjs/data-channel/types';
import { defineMessages } from 'react-intl';

import { PickedUser } from '../../pick-random-user/types';
import { PresenterViewComponentProps } from './types';

const intlMessages = defineMessages({
  optionsTitle: {
    id: 'pickRandomUserPlugin.modal.presenterView.optionSection.title',
    description: 'Title of the options section on modal`s presenter view',
  },
  skipModeratorsLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.optionSection.skipModeratorsLabel',
    description: 'Label of skip moderator`s option on modal`s presenter view',
  },
  skipPresenterLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.optionSection.skipPresenterLabel',
    description: 'Label of skip presenter`s option on modal`s presenter view',
  },
  includePickedUsersLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.optionSection.includePickedUsersLabel',
    description: 'Label of include picked users option on modal`s presenter view',
  },
  availableTitle: {
    id: 'pickRandomUserPlugin.modal.presenterView.availableSection.title',
    description: 'Title of the "available users" section on modal`s presenter view',
  },
  userLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.availableSection.userLabel',
    description: 'Label to count user in "available users" section on presenter view',
  },
  userLabelPlural: {
    id: 'pickRandomUserPlugin.modal.presenterView.availableSection.userLabelPlural',
    description: 'Label to count users in "available users" section on presenter view',
  },
  viewerLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.availableSection.viewerLabel',
    description: 'Label to count viewer in "available users" section on presenter view',
  },
  viewerLabelPlural: {
    id: 'pickRandomUserPlugin.modal.presenterView.availableSection.viewerLabelPlural',
    description: 'Label to count viewers in "available users" section on presenter view',
  },
  previouslyPickedTitle: {
    id: 'pickRandomUserPlugin.modal.presenterView.previouslyPickedSection.title',
    description: 'Title of the "previously picked" section on presenter view',
  },
  clearButtonLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.previouslyPickedSection.clearButtonLabel',
    description: 'Label of button to clear list of already picked users',
  },
  noUsersWarning: {
    id: 'pickRandomUserPlugin.modal.presenterView.previouslyPickedSection.noUsersWarning',
    description: 'Warning that there is no user to be picked',
  },
  pickButtonLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.previouslyPickedSection.pickButtonLabel.pickUser',
    description: 'Label of the button to pick another user',
  },
  pickAgainButtonLabel: {
    id: 'pickRandomUserPlugin.modal.presenterView.previouslyPickedSection.pickButtonLabel.pickAgain',
    description: 'Label of the button to pick another user',
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
    <div
      style={{
        width: '100%', height: '100%', alignItems: 'flex-start', display: 'flex', flexDirection: 'column',
      }}
    >
      <div className="moderator-view-wrapper">
        <p className="moderator-view-label">{intl.formatMessage(intlMessages.optionsTitle)}</p>
        <p className="moderator-view-value">
          <label className="check-box-label-container" htmlFor="skipModerators">
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
            <span className="check-box-label">{intl.formatMessage(intlMessages.skipModeratorsLabel)}</span>
          </label>
          <label className="check-box-label-container" htmlFor="skipPresenter">
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
            <span className="check-box-label">{intl.formatMessage(intlMessages.skipPresenterLabel)}</span>
          </label>
          <label className="check-box-label-container" htmlFor="includePickedUsers">
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
            <span className="check-box-label">{intl.formatMessage(intlMessages.includePickedUsersLabel)}</span>
          </label>
        </p>
      </div>
      <div className="moderator-view-wrapper">
        <p className="moderator-view-label">{intl.formatMessage(intlMessages.availableTitle)}</p>
        <p className="moderator-view-value">
          {`${users?.length} ${userRoleLabel}: `}
          {makeHorizontalListOfNames(users)}
        </p>
      </div>
      <div className="moderator-view-wrapper">
        <div className="moderator-view-wrapper-title">
          <p className="moderator-view-label">{intl.formatMessage(intlMessages.previouslyPickedTitle)}</p>
          <button
            type="button"
            className="clickable"
            onClick={() => {
              deletionFunction([RESET_DATA_CHANNEL]);
            }}
          >
            {intl.formatMessage(intlMessages.clearButtonLabel)}
          </button>
        </div>
        <ul className="moderator-view-list">
          {
            makeVerticalListOfNames(dataChannelPickedUsers)
          }
        </ul>
      </div>
      {
        users?.length > 0 ? (
          <button
            type="button"
            className="button-style"
            onClick={() => {
              handlePickRandomUser();
            }}
          >
            {
            (pickedUserWithEntryId)
              ? intl.formatMessage(intlMessages.pickAgainButtonLabel)
              : intl.formatMessage(intlMessages.pickButtonLabel, { 0: userRoleLabel })
            }
          </button>
        ) : (
          <p>
            {intl.formatMessage(intlMessages.noUsersWarning, { 0: userRoleLabel })}
          </p>
        )
      }
    </div>
  );
}
