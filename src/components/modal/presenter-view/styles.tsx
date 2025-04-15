import styled from 'styled-components';

const PresenterViewContentWrapper = styled.div`
  width: '100%';
  height: '100%';
  align-items: 'flex-start';
  display: 'flex';
  flex-direction: 'column';
`;

const PresenterViewSectionWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  max-height: 30%;
`;

const PresenterViewSectionTitle = styled.div`
  margin: 5px 0px;
  font-weight: 600;
  font-size: 20px;
`;

const PresenterViewSectionClearAllButton = styled.button`
  padding: 1px 10px;
  margin-left: 8px;
  font-size: 15px;
  background: #efefef;
  border: none;
  color: inherit;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: #ddd;
  }
`;

const PresenterViewSectionTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const PresenterViewSectionListWrapper = styled.div`
  overflow-y: auto;
  max-height: 10rem;
  margin-bottom: .75rem;
  width: 100%;
`;

const PresenterViewSectionList = styled.ul`
  font-size: 18px;
  margin: 0;
  list-style-type: none;
`;

const PresenterViewSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 18px;
  padding-left: 40px;
`;

// Section Content related:

const CheckboxLabelWrapper = styled.label`
  display: flex;
  align-items: center;
`;

const CheckboxLabel = styled.span`
  margin-left: 5px;
`;

const PickUserButton = styled.button`
  border: 3px solid transparent;
  overflow: visible;
  display: inline-block;
  background-color: #0F70D7;
  color: #FFF;
  border-radius: 2px;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  padding: 8px 15px;
  &:hover {
    background-color: #0C57A7;
  }
`;

export {
  PresenterViewContentWrapper,
  PresenterViewSectionWrapper,
  PresenterViewSectionTitle,
  PresenterViewSectionTitleWrapper,
  PresenterViewSectionList,
  PresenterViewSectionListWrapper,
  PresenterViewSectionContent,
  CheckboxLabelWrapper,
  CheckboxLabel,
  PickUserButton,
  PresenterViewSectionClearAllButton,
};
