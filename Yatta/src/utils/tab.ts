export const getCurrentTab = async () => {
  const [tab] = await browser.tabs.query({active: true, lastFocusedWindow: true});
  return tab;
}