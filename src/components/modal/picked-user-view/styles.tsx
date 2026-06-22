import styled from 'styled-components';

const PickedUserViewWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const PickedUserViewBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
`;

const PickedUserViewFooter = styled.div`
  padding: 0 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ResultSectionLabel = styled.span`
  font-size: 1.3rem;
  font-weight: 800;
  color: #8B9AAF;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin: 1.25rem 0;
`;

const PickedUserName = styled.p`
  font-size: 2.625rem;
  font-weight: 500;
  margin: 1.25rem 0;
`;

const BackButton = styled.button`
  width: 100%;
  padding: 0.875rem 0;
  background: #4E7FF8;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  font-size: 1.125rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: #3D6DE0;
  }
`;

export {
  PickedUserViewWrapper,
  PickedUserViewBody,
  PickedUserViewFooter,
  ResultSectionLabel,

  PickedUserName,
  BackButton,
};
