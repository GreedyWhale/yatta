export const showNotification = (message: string) => {
  browser.notifications.create({
    type: 'basic',
    iconUrl: browser.runtime.getURL('/icon/128.png'),
    title: 'Yatta',
    message,
  });
}