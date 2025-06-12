<script lang="ts">
  import type { Message } from "~/types/message";

import content from "@/entrypoints/content";
    import { format } from 'date-fns';

  interface Props {
    message: Message;
    onClose: () => void;
  }

  const { message, onClose }: Props = $props();
  const datasource = {
    ...message,
    createdAt: format(new Date(), 'yyyy-m-d hh:mm a')
  };
</script>

<div class="fixed inset-0 bg-black/30 z-1 flex items-center justify-center">
  <div class="rounded-xl p-4 backdrop-blur-md bg-[rgba(255,245,230,0.6)] text-[#333] shadow-md w-[40%] border border-white/40">
    <h3 class="text-lg font-bold mb-4 pb-4 border-b border-[#f0f0f0] flex items-center justify-between">
      Yatta - ✍️ 保存选中文本
    </h3>
    <div>
      <ul class="font-md font-medium mb-8">
        <li class="flex items-center mb-4">
          <span class="mr-4">📅</span>
          <span>{datasource.createdAt}</span>
        </li>
        <li class="flex items-center mb-4">
          <span class="mr-4">🌐</span>
          <span title={datasource.payload.pageInfo.title} class="line-clamp-1">{datasource.payload.pageInfo.title}</span>
        </li>
        <li class="flex items-center mb-4">
          <span class="mr-4">🔗</span>
          <a href={datasource.payload.pageInfo.url} target="_blank" class=" underline-offset-2 line-clamp-1 hover:underline">
            {datasource.payload.pageInfo.url}
          </a>
        </li>
        <li class="flex items-start mb-4">
          <span class="mr-4">✒️</span>
          <p class="max-h-[100px] overflow-y-auto text-[#8a2be2] leading-[1.75] italic scroll-area">
            {datasource.payload.content}
          </p>
        </li>
      </ul>

      <div class="flex items-center justify-end">
        <button
          onclick={onClose}
          class="cursor-pointer rounded mr-4 px-6 py-2 text-[#78716c] transition-all hover:bg-[rgba(120,113,108,0.14)]"
        >
          取消
        </button>
        <button class="cursor-pointer rounded px-6 py-2 text-[#16a34a] hover:bg-[rgba(22,163,74,0.18)]">保存</button>
      </div>
    </div>
  </div>
</div>