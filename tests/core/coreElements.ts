export const coreElements = {
  audioModal: 'div[data-test="audioModal"]',
  closeModal: 'button[data-test="closeModal"]',
  errorMessageLabel: 'span[id="error-message"]',
  whiteboard: 'div[data-testid="canvas"]',
  // BigBlueButton 4.0 has no actions-button dropdown. Plugins that contribute a sidekick
  // area are reached through the apps gallery in the navigation sidebar instead.
  appsGallerySidebarButton: 'div[data-test="appsGallerySidebarButton"]',
  appsGalleryTitle: 'header[data-test="appsGalleryTitle"]',
  hideAppsGallery: 'button[data-test="hideAppsGallery"]',
};
