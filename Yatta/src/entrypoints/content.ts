import type { Message } from '@/types';

import { mount, unmount } from 'svelte';
import Dialog from '~/lib/Dialog.svelte';
import '~/assets/styles/tailwindcss-global.css';
import '~/assets/styles/save-dialog.scss';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',
  main(ctx) {
    browser.runtime.onMessage.addListener((message: Message) => {
      handleSaveSection(message, ctx)
    });
  },
});

async function handleSaveSection(message: Message, ctx: InstanceType<typeof ContentScriptContext>) {
  if (message.menuId !== MENU_ID_SELECTION) {
    return;
  }

  const ui = await createShadowRootUi(ctx, {
    name: 'save-dialog',
    position: 'modal',
    zIndex: 9999,
    anchor: 'body',
    onMount: (container) => {
      // Create the Svelte app inside the UI container
      return mount(Dialog, {
        target: container,
        props: {
          message,
          onClose: () => {
            ui.remove();
          }
        }
      });
    },
    onRemove: (app) => {
      // Destroy the app when the UI is removed
      app && unmount(app);
    },
  });

  ui.mount();
}
