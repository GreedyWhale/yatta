import type { NoteMessage } from '@/types';

import { mount, unmount } from 'svelte';
import Dialog from '~/lib/Dialog.svelte';
import '~/assets/styles/save-dialog.scss';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',
  main(ctx) {
    browser.runtime.onMessage.addListener((message: NoteMessage) => {
      handleSaveSection(message, ctx)
    });
  },
});

async function handleSaveSection(message: NoteMessage, ctx: InstanceType<typeof ContentScriptContext>) {
  if (message.id !== MENU_ID_SELECTION) {
    return;
  }

  const ui = await createShadowRootUi(ctx, {
    name: 'save-dialog',
    position: 'modal',
    anchor: 'body',
    onMount: (container) => {
      // Create the Svelte app inside the UI container
      return mount(Dialog, {
        target: container,
        props: {
          message,
          onClose: (message?: string) => {
            ui.remove();

            if (message) {
              browser.runtime.sendMessage({
                id: MESSAGE_ID_NOTIFICATION,
                payload: message,
              })
            }
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
