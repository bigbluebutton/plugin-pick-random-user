import styled from 'styled-components';
import { Switch } from '@mui/material';
import { styled as materialStyled } from '@mui/material/styles';
import {
  colorPrimary,
  colorGray,
  colorWhite,
  colorHeading,
} from '../../styles/pallete';
import {
  defaultPanelPadding,
  defaultPanelSubtitleFontSize,
  defaultPanelTextFontSize,
} from '../../styles/general';

const PanelContainer = styled.div`
  width: 100%;
  height: 100%;
  max-height: 100%;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  padding: 0 ${defaultPanelPadding} ${defaultPanelPadding};
  background-color: ${colorWhite};
  color: ${colorGray};
  gap: 1.5rem;
`;

const PanelSubTitle = styled.p`
  color: ${colorHeading};
  font-size: ${defaultPanelSubtitleFontSize};
  font-weight: 600;
  margin: 0.7rem 0;
`;

const PanelSectionWrapperGrow = styled.div`
  width: 100%;
  flex-grow: 1;
`;

const PanelSectionWrapperGrowScrollable = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const PanelSectionWrapperNotGrow = styled.div`
  width: 100%;  
  flex-grow: 0;
`;

const OptionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

const OptionContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const OptionLabel = styled.label`
  font-size: ${defaultPanelTextFontSize};
`;

const AlreadyPickedWarpper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.7rem;
  align-items: center;
`;

const MaterialSwitch = materialStyled(Switch)(({ theme }) => ({
  width: '2.3rem',
  height: '1.2rem',
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(1.2rem)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: '0.2rem',
    '&.Mui-checked': {
      transform: 'translateX(1.2rem)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: colorPrimary,
        ...theme.applyStyles('dark', {
          backgroundColor: colorPrimary,
        }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: '0.6rem',
    height: '0.6rem',
    borderRadius: '0.5rem',
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
    transform: 'translateY(1px)',
  },
  '& .MuiSwitch-track': {
    borderRadius: '0.6rem',
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
    ...theme.applyStyles('dark', {
      backgroundColor: 'rgba(255,255,255,.35)',
    }),
  },
}));

const PickRandomUserButtonWrapper = styled.div`
  width: 100%;
  display: flex;

  > * {
    width: 100%;
  }
`;

const ScrollboxVertical = styled.div`
  overflow-y: auto;
  background: linear-gradient(white 30%, rgba(255,255,255,0)),
    linear-gradient(rgba(255,255,255,0), white 70%) 0 100%,
    /* Shadows */
    radial-gradient(farthest-side at 50% 0, rgba(0,0,0,.2), rgba(0,0,0,0)),
    radial-gradient(farthest-side at 50% 100%, rgba(0,0,0,.2), rgba(0,0,0,0)) 0 100%;

  background-repeat: no-repeat;
  background-color: transparent;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  background-attachment: local, local, scroll, scroll;

  // Fancy scroll
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
`;

export default {
  PanelContainer,
  PanelSubTitle,
  PanelSectionWrapperGrow,
  PanelSectionWrapperGrowScrollable,
  PanelSectionWrapperNotGrow,
  OptionsWrapper,
  OptionContainer,
  OptionLabel,
  AlreadyPickedWarpper,
  MaterialSwitch,
  PickRandomUserButtonWrapper,
  ScrollboxVertical,
};
