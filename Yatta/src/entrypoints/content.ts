import type { Message } from '~/types/message.d.ts';

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    browser.runtime.onMessage.addListener((message: Message) => {
      handleSaveSection(message)
    });
  },
});

function handleSaveSection(message: Message) {
  console.log('Save selection.', message);
}
