<script lang="ts">
  import type { NoteMessage } from "~/types";
  import type { Tag } from '~/utils/db';

  import { format, getTime } from 'date-fns';
  import { liveQuery } from "dexie";
  import { nanoid } from 'nanoid';

  import { db } from '~/utils/db';
  import deleteIcon from '~/assets/icons/close-line.svg';

  interface Props {
    message: NoteMessage;
    onClose: (message?: string) => void;
  }

  const { message, onClose }: Props = $props();
  const datasource = {
    ...message,
    createdAt: format(new Date(), 'yyyy-m-d hh:mm a')
  };

  const tags = liveQuery(() => db.tags.toArray());

  let isOpened = $state(false);
  let inputValue = $state('');
  let selectedTags = $state<(Required<Pick<Tag, "name">> & Partial<Omit<Tag, "name">>)[]>([]);
  const displayTags = $derived.by(() => {
    if (inputValue) {
      return [{ name: inputValue }, ...$tags.filter(tag => tag.name.includes(inputValue))];
    }

    return $tags;
  });

  const onSave = async () => {
    if (selectedTags.length === 0) {
      alert('请至少选择一个标签');
      return;
    }

    // 过滤重复的标签
    const uniqueTags = selectedTags.filter((tag, index, self) =>
      index === self.findIndex(t => t.name === tag.name)
    );

    const tagsWithoutId = uniqueTags
      .filter(tag => !tag.id)
      .map(tag => ({
        id: nanoid(),
        name: tag.name,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }));

    const errorMessage = await Promise.all([
      db.tags.bulkAdd(tagsWithoutId),
      db.notes.add({
        id: nanoid(),
        ...datasource.payload,
        tags: uniqueTags.map(tag => tag.name),
        createdAt: getTime(datasource.createdAt),
        updatedAt: getTime(datasource.createdAt)
      })
    ])
      .then(() => null)
      .catch((error) => error.message);

    if (errorMessage) {
      console.error('保存失败:', errorMessage);
      alert(`保存失败: ${errorMessage}`);
      return;
    }

    onClose('保存成功 !');
  };
</script>

<div class="dialog-overlay">
  <div class="dialog-container">
    <h3 class="dialog-header">
      Yatta - ✍️ 保存选中文本
    </h3>
    <div>
      <ul class="dialog-list">
        <li class="dialog-list-item">
          <span class="dialog-list-item-content">📅</span>
          <span>{datasource.createdAt}</span>
        </li>
        <li class="dialog-list-item">
          <span class="dialog-list-item-content">🌐</span>
          <span title={datasource.payload.pageInfo.title} class="dialog-link">{datasource.payload.pageInfo.title}</span>
        </li>
        <li class="dialog-list-item">
          <span class="dialog-list-item-content">🔗</span>
          <a href={datasource.payload.pageInfo.url} target="_blank" class="dialog-link">
            {datasource.payload.pageInfo.url}
          </a>
        </li>
        <li class="dialog-list-item">
          <span class="dialog-list-item-content">✒️</span>
          <p class="dialog-content">
            {datasource.payload.content}
          </p>
        </li>
        <li class="dialog-tags">
          <span class="dialog-list-item-content">🏷️</span>
          <div class="dialog-tag-input-wrapper">
            {#if selectedTags.length > 0}
              {#each selectedTags as tag}
                <span class="dialog-tag-selected">
                  {tag.name}
                  <button
                    class="dialog-tag-remove"
                    onclick={() => {
                      selectedTags = selectedTags.filter(t => t.name !== tag.name);
                    }}
                  >
                    <img src={deleteIcon} alt="delete tag">
                  </button>
                </span>
              {/each}
            {/if}
            <input
              name="label"
              type="text"
              placeholder="请选择或输入标签，比如: 灵感, 收藏, 待办"
              class="dialog-tag-input"
              bind:value={inputValue}
              onfocus={() => isOpened = true}
              onblur={() => isOpened = false}
              oninput={(e) => inputValue = (e.target as HTMLInputElement).value}
              onclick={() => {
                if (!isOpened) {
                  isOpened = true;
                }
              }}
            >
            <ul
              class="dialog-tag-list {isOpened ? 'opened' : ''}"
            >
              {#if displayTags}
                {#each displayTags as tag}
                  <li class="dialog-tag-list-item">
                    <button
                      onmousedown={(event) => {
                        event.preventDefault(); // 防止 input 失焦
                        event.stopPropagation();
                        selectedTags = [...selectedTags, tag];
                        inputValue = '';
                        isOpened = false;
                      }}
                    >
                      # {tag.name}
                    </button>
                  </li>
                {/each}
              {/if}
            </ul>
          </div>
        </li>
      </ul>

      <div class="dialog-footer">
        <button
          onclick={() => onClose()}
          class="dialog-btn-cancel"
        >
          关闭
        </button>
        <button class="dialog-btn-save" onclick={onSave}>保存</button>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
/* 由于 shadowDOM 中 rem 会找到宿主页面的html元素，所以这里不用 tailwindcss */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
}

.dialog-container {
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(8px);
  background: rgba(255, 245, 230, 0.6);
  color: #333;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  width: 40%;
  border: 1px solid rgba(255,255,255,0.4);
}

.dialog-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dialog-list {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 32px;
  list-style: none;
  padding: 0;
}

.dialog-list-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.dialog-list-item-content {
  margin-right: 16px;
}

.dialog-link {
  text-underline-offset: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  transition: text-decoration 0.2s;
  text-decoration: none;
  color: #333;
}

a.dialog-link:hover {
  text-decoration: underline;
  color: #1e40af;
}

.dialog-content {
  max-height: 100px;
  overflow-y: auto;
  color: #8a2be2;
  line-height: 1.75;
  font-style: italic;
  scrollbar-width: thin;
  scrollbar-color: #69799d transparent; /* thumb, track */
}

.dialog-tags {
  display: flex;
  align-items: flex-start;
  margin-bottom: 32px;
}

.dialog-tag-input-wrapper {
  border-bottom: 1px solid #f0f0f0;
  width: 100%;
  position: relative;
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
}

.dialog-tag-selected {
  display: flex;
  align-items: center;
  border-radius: 4px;
  background: #f0f0f0;
  color: #c41d7f;
  margin-right: 2px;
  margin-bottom: 2px;
  padding: 4px;
  > button {
    background-color: transparent;
    border: none;
    margin-left: 5px;
    padding: 0;
    display: flex;
    align-items: center;
    cursor: pointer;
    > img {
      width: 16px;
      height: 16px;
    }
  }
}

.dialog-tag-input {
  height: 28px;
  outline: none;
  display: block;
  flex: 1;
  border: none;
  background: transparent;
}

.dialog-tag-list {
  transform: scaleY(0);
  transform-origin: top;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 100px;
  overflow-y: auto;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-radius: 6px;
  padding: 8px;
  transition: transform 0.2s;
  z-index: 2;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  list-style: none;
  &.opened {
    transform: scaleY(1);
  }
}

.dialog-tag-list-item {
  > button {
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    padding: 0 8px;
    border: none;
    background-color: transparent;
    color: #c41d7f;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s;
    &:hover {
      background: #f0f0f0;
    }
  }
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.dialog-btn-cancel {
  cursor: pointer;
  border-radius: 6px;
  margin-right: 16px;
  padding: 8px 24px;
  color: #78716c;
  transition: background 0.2s;
  background: transparent;
  border: none;
  &:hover {
    background: rgba(120,113,108,0.14);
  }
}

.dialog-btn-save {
  cursor: pointer;
  border-radius: 6px;
  padding: 8px 24px;
  color: #000;
  background: transparent;
  border: none;
  transition: background 0.2s;
  &:hover {
    background: rgba(22,163,74,0.18);
  }
}

@media (max-width: 1024px) {
  .dialog-container {
    width: 60%;
  }
}

@media (max-width: 768px) {
  .dialog-container {
    width: 90%;
  }
}
</style>

