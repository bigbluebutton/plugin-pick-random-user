import styled from 'styled-components';
import { ModalAvatarProps } from './types';

const PickedUserViewWrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const PickedUserViewTitle = styled.h1`
  font-weight: 600;
  font-size: 20px;
`;

const PickedUserAvatarInitials = styled.div<ModalAvatarProps>`
  background-color: ${({ background }) => background};
  height: 6rem;
  width: 6rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 2.75rem;
  font-weight: 400;
  margin-bottom: .25rem;
  text-transform: capitalize;
`;

const PickedUserAvatarImage = styled.img`
  height: 8rem;
  width: 8rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PickedUserName = styled.p`
  font-size: 30px;
  font-weight: 500;
`;

const BackButton = styled.button`
  border: 3px solid transparent;
  overflow: visible;
  display: inline-block;
  background-color: var(--btn-primary-bg, var(--color-primary, #0F70D7));
  color: var(--btn-primary-color, var(--color-white, #FFF));
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
    color: var(--btn-primary-color, var(--color-white, #FFF));
    background-color: var(--btn-primary-hover-bg, #0C57A7) !important;
  }
`;

export {
  PickedUserViewWrapper,
  PickedUserViewTitle,
  PickedUserAvatarInitials,
  PickedUserAvatarImage,
  PickedUserName,
  BackButton
};
