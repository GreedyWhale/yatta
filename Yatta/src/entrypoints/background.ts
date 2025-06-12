import type { Message } from '~/types/message.d.ts';

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    createContextMenu();
  });

  browser.contextMenus.onClicked.addListener(async (...args) => {
    handleSelection(...args);
  });
});


function createContextMenu() {
  browser.contextMenus.create({
    id: MENU_ID_SELECTION,
    title: 'Yatta - ✍️ 保存选中文本',
    type: 'normal',
    contexts: ['selection'],
  });
}

async function handleSelection(info: Browser.contextMenus.OnClickData, tab?: Browser.tabs.Tab) {
  const _tab = tab || (await getCurrentTab());
  if (!_tab.id) {
    showNotification('无法获取当前页面信息，请重新打开页面');
    return;
  }

  if (!info.selectionText) {
    showNotification('无法获取选中文本，请重新选择');
    return;
  }

  const message: Message = {
    menuId: MENU_ID_SELECTION,
    payload: {
      pageInfo: {
        url: _tab.url || '',
        title: _tab.title || '',
      },
      content: info.selectionText,
    },
  }

  browser.tabs.sendMessage(_tab.id, message);
}