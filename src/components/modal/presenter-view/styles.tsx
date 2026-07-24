import styled, { keyframes } from 'styled-components';

// ── Section labels ────────────────────────────────────────────────────────────

const SectionLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  color: #8B9AAF;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

// ── Filter chips section ──────────────────────────────────────────────────────

const FilterRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const FilterLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #8B9AAF;
  white-space: nowrap;
`;

const ChipGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
`;

const ChipInput = styled.input`
  display: none;
`;

const FilterChip = styled.label<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  font-size: 0.75rem;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s;

  ${({ $active }) => ($active ? `
    background: #EBF1FF;
    border: 1.5px solid #4E7FF8;
    color: #4E7FF8;
    font-weight: 600;
  ` : `
    background: #F0F2F6;
    border: 1.5px solid #D1D9E3;
    color: #8B9AAF;
    font-weight: 500;
  `)}
`;

// ── Section header row (label + count/action) ─────────────────────────────────

const SectionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

// ── Available users section ───────────────────────────────────────────────────

const CountBadge = styled.span`
  font-size: 0.75rem;
  color: #4E7FF8;
  font-weight: 600;
`;

const UserListContainer = styled.div`
  background: #F7F9FB;
  border-radius: 0.375rem;
  padding: 0.625rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  max-height: 12rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 999px;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
`;

const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserNameText = styled.span`
  font-size: 0.8125rem;
  color: #1C2B3A;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RoleBadge = styled.span`
  font-size: 0.625rem;
  color: #8B9AAF;
  background: #E8EDF2;
  padding: 0.0625rem 0.375rem;
  border-radius: 0.1875rem;
  margin-left: auto;
  flex-shrink: 0;
  white-space: nowrap;
`;

// ── Previously picked section ─────────────────────────────────────────────────

const ClearAllButton = styled.button`
  font-size: 0.6875rem;
  color: #8B9AAF;
  background: none;
  border: none;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #6b7d92;
  }
`;

const EmptyStateContainer = styled.div`
  background: #F7F9FB;
  border-radius: 0.375rem;
  padding: 0.875rem;
  text-align: center;
`;

const EmptyStateText = styled.span`
  font-size: 0.8125rem;
  color: #A7B3C3;
`;

// ── Loading state (shown while the first user snapshot has not arrived yet) ────

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  background: #F7F9FB;
  border-radius: 0.375rem;
  padding: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const SpinnerRing = styled.span`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 2px solid #D1D9E3;
  border-top-color: #4E7FF8;
  animation: ${spin} 0.7s linear infinite;
  flex-shrink: 0;
`;

const LoadingText = styled.span`
  font-size: 0.8125rem;
  color: #A7B3C3;
`;

const PickedUserListContainer = styled(UserListContainer)`
`;

// <ul> that test selectors target with [data-test="pickRandomUserPreviouslyPickedList"]
const PickedList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const PickedUserRow = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  list-style: none;
`;

const PickedTimeText = styled.span`
  font-size: 0.6875rem;
  color: #A7B3C3;
  margin-left: auto;
  flex-shrink: 0;
`;

// ── Footer / action button ────────────────────────────────────────────────────

const FooterContainer = styled.div`
  padding: 0 1.25rem 1rem;
`;

const PickButton = styled.button`
  width: 100%;
  padding: 0.625rem 0;
  background: #4E7FF8;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;

  &:hover {
    background: #3D6DE0;
  }
`;

const NoUsersWarning = styled.p`
  font-size: 0.8125rem;
  color: #8B9AAF;
  text-align: center;
  margin: 0;
  padding: 0.5rem 0;
`;

// ── Outer wrappers ────────────────────────────────────────────────────────────

const PresenterViewWrapper = styled.div`
  font-family: 'Source Sans Pro', Arial, sans-serif;
`;

const ContentPadding = styled.div`
  padding: 1rem 1.25rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionsSection = styled.div``;

const AvailableSection = styled.div``;

const PreviouslyPickedSection = styled.div``;

export {
  SectionLabel,
  FilterRow,
  FilterLabel,
  ChipGroup,
  ChipInput,
  FilterChip,
  SectionHeaderRow,
  CountBadge,
  UserListContainer,
  UserRow,

  UserNameText,
  RoleBadge,
  ClearAllButton,
  EmptyStateContainer,
  EmptyStateText,
  LoadingContainer,
  SpinnerRing,
  LoadingText,
  PickedUserListContainer,
  PickedList,
  PickedUserRow,
  PickedTimeText,
  FooterContainer,
  PickButton,
  NoUsersWarning,
  PresenterViewWrapper,
  ContentPadding,
  OptionsSection,
  AvailableSection,
  PreviouslyPickedSection,
};
