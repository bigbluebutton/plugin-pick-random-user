import styled from 'styled-components';

const s = (val: number, unit = 'rem') => `calc(${val}${unit} * var(--pru-sm, 1))`;

const PickedUserViewWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const PickedUserViewBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${s(1.5)};
`;

const PickedUserViewFooter = styled.div`
  padding: 0 ${s(1.5)} ${s(1.25)};
  display: flex;
  flex-direction: column;
  gap: ${s(0.75)};
`;

const ResultSectionLabel = styled.span`
  font-size: ${s(1.3)};
  font-weight: 800;
  color: #8B9AAF;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin: ${s(1.25)} 0;
`;

const PickedUserName = styled.p`
  font-size: ${s(2.625)};
  font-weight: 500;
  margin: ${s(1.25)} 0;
`;

const BackButton = styled.button`
  width: 100%;
  padding: ${s(0.875)} 0;
  background: #4E7FF8;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  font-size: ${s(1.125)};
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
