import styled from 'styled-components';

/**
 * Root of the sidekick panel. It defines `--pru-sm`, the scale custom property that
 * every `s()` helper in the shared styles reads, so the `modalUiScale` setting applies
 * to the panel exactly like it does to the modal.
 */
const PanelWrapper = styled.div<{ $modalUiScale?: number }>`
  --pru-sm: ${({ $modalUiScale }) => $modalUiScale ?? 1};
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  color: #1C2B3A;
  font-family: 'Source Sans Pro', Arial, sans-serif;
`;

export { PanelWrapper };
