import * as ReactModal from 'react-modal';
import styled, { css, keyframes } from 'styled-components';

const s = (val: number, unit = 'rem') => `calc(${val}${unit} * var(--pru-sm, 1))`;

const PluginModal = styled(ReactModal)<{ $modalUiScale?: number }>`
  --pru-sm: ${({ $modalUiScale }) => $modalUiScale ?? 1};
  position: relative;
  z-index: 1000 !important;
  outline: transparent;
  outline-width: 2px;
  outline-style: solid;
  display: flex;
  flex-direction: column;
  background-color: #fff !important;
  width: ${s(32)};
  max-width: 95vw;
  max-height: 90vh;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.4);
  overflow: hidden;
  font-family: 'Source Sans Pro', Arial, sans-serif;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-button {
    width: 0;
    height: 0;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.25);
    border: none;
    border-radius: 50px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.5);
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 50px;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${s(1.25)} ${s(1.5)} ${s(1.125)};
  border-bottom: 1px solid #E8EDF2;
  flex-shrink: 0;
`;

const ModalTitle = styled.span`
  font-weight: 600;
  font-size: ${s(1.55)};
  color: #1C2B3A;
`;

const CloseButton = styled.button`
  font-size: ${s(1.3)};
  background: none;
  color: #8B9AAF;
  border: none;
  cursor: pointer;
  padding: ${s(0.375)};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  line-height: 1;

  &:hover {
    background-color: #EEF2F8;
    color: #1C2B3A;
  }
`;

const toastSlideIn = keyframes`
  from { opacity: 0; transform: translateX(-50%) translateY(8px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
`;

const toastSlideOut = keyframes`
  from { opacity: 1; transform: translateX(-50%) translateY(0); }
  to   { opacity: 0; transform: translateX(-50%) translateY(8px); }
`;

/* position:relative so the absolutely-positioned toast anchors to this wrapper,
   not to the overlay. The wrapper's own height equals only the modal — no shift. */
const ModalWithToastWrapper = styled.div`
  position: relative;
`;

const FloatingToast = styled.div<{ $exiting: boolean }>`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: ${s(10, 'px')};
  width: fit-content;
  white-space: nowrap;
  padding: ${s(12, 'px')} ${s(20, 'px')};
  border-radius: 10px;
  background-color: #fff;
  border: 0.5px solid #E8EDF2;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: ${s(10, 'px')};
  font-family: 'Source Sans Pro', Arial, sans-serif;
  font-size: ${s(17, 'px')};
  color: #6c757d;
  pointer-events: none;
  ${({ $exiting }) => css`
    animation: ${$exiting ? toastSlideOut : toastSlideIn} 0.35s ease forwards;
  `}
`;

export {
  PluginModal, ModalHeader, ModalTitle, CloseButton, ModalWithToastWrapper, FloatingToast,
};
