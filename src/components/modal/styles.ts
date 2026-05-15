import styled from 'styled-components';
import ReactModal from 'react-modal';
import { colorGrayLightest, colorPrimary } from '../../styles/pallete';

const PluginModal = styled(ReactModal)`
  position: relative;
  z-index: 900 !important;

  outline: transparent;
  outline-width: 2px;
  outline-style: solid;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.7);
  background-color: #FFF !important;
  max-width: 60vw;
  max-height: 100%;
  border-radius: .2rem;
  
  color: #4E5A66;
  
  overflow: auto;

  overflow-y: hidden;

  background-repeat: no-repeat;
  background-color: transparent;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  background-attachment: local, local, scroll, scroll;

  &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
  }
  &::-webkit-scrollbar-button {
      width: 0;
      height: 0;
  }
  &::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,.25);
      border: none;
      border-radius: 50px;
  }
  &::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,.5); }
  &::-webkit-scrollbar-thumb:active { background: rgba(0,0,0,.25); }
  &::-webkit-scrollbar-track {
      background: rgba(0,0,0,.25);
      border: none;
      border-radius: 50px;
  }
  &::-webkit-scrollbar-track:hover { background: rgba(0,0,0,.25); }
  &::-webkit-scrollbar-track:active { background: rgba(0,0,0,.25); }
  &::-webkit-scrollbar-corner { background: 0 0; }

  @media only screen and (max-width: 40em) {
      max-width: 95vw;
  }

  @media only screen and (min-width: 40.063em) {
      max-width: 80vw;
  }
`;

const ModalOverlay = `
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(6, 23, 42, 0.75);
`;

const ModalContainer = styled.div`
  width: 100%;
  align-items: flex-end;
  display: flex;
  flex-direction: column;
`;

const ButtonClose = styled.button`
  font-size: 40px;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  border: none;

  &:hover {
    background-color: #EEE;
  }
`;

const ProgressBarContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-color: ${colorGrayLightest};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ progress: number }>`
  height: 100%;
  background-color: ${colorPrimary};
  width: ${({ progress }) => `${progress}%`};
  transition: width 0.03s linear;
`;

export default {
  PluginModal,
  ModalOverlay,
  ModalContainer,
  ButtonClose,
  ProgressBarContainer,
  ProgressBarFill,
};
