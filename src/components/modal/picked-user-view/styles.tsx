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

export {
  PickedUserViewWrapper,
  PickedUserViewTitle,
  PickedUserAvatarInitials,
  PickedUserAvatarImage,
  PickedUserName,
};
