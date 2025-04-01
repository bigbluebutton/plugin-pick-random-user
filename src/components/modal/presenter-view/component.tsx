import * as React from 'react';
import { RESET_DATA_CHANNEL } from 'bigbluebutton-html-plugin-sdk';
import { DataChannelEntryResponseType } from 'bigbluebutton-html-plugin-sdk/dist/cjs/data-channel/types';

import * as Styled from './styles';
import { PickedUser } from '../../pick-random-user/types';
import { PresenterViewComponentProps } from './types';

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
  return (
    <li key={u.payloadJson.userId}>
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
    userRole,
  } = props;

  return (
    <Styled.PresenterViewContentWrapper>
      <Styled.PresenterViewSectionWrapper>
        <Styled.PresenterViewSectionTitle>Options</Styled.PresenterViewSectionTitle>
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
            <Styled.CheckboxLabel>Skip moderators</Styled.CheckboxLabel>
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
            <Styled.CheckboxLabel>Skip Presenter</Styled.CheckboxLabel>
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
            <Styled.CheckboxLabel>Include already picked users</Styled.CheckboxLabel>
          </Styled.CheckboxLabelWrapper>
        </Styled.PresenterViewSectionContent>
      </Styled.PresenterViewSectionWrapper>
      <Styled.PresenterViewSectionWrapper>
        <Styled.PresenterViewSectionTitle>Available for selection</Styled.PresenterViewSectionTitle>
        <Styled.PresenterViewSectionContent>
          {users?.length}
          {' '}
          {userRole}
          :
          {' '}
          {makeHorizontalListOfNames(users)}
        </Styled.PresenterViewSectionContent>
      </Styled.PresenterViewSectionWrapper>
      <Styled.PresenterViewSectionWrapper>
        <Styled.PresenterViewSectionTitleWrapper>
          <Styled.PresenterViewSectionTitle>Previously picked</Styled.PresenterViewSectionTitle>
          <Styled.PresenterViewSectionClearAllButton
            type="button"
            onClick={() => {
              deletionFunction([RESET_DATA_CHANNEL]);
            }}
          >
            Clear All
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
            (pickedUserWithEntryId) ? 'Pick again' : `Pick ${userRole}`
            }
          </Styled.PickUserButton>
        ) : (
          <p>
            No
            {' '}
            {userRole}
            {' '}
            available to randomly pick from
          </p>
        )
      }
    </Styled.PresenterViewContentWrapper>
  );
}
