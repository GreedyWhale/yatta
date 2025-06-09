<script lang="ts">
  import clsx from "clsx";
  import type { Snippet } from 'svelte';
  import addIcon from '~/assets/images/add-line.svg';
  import backIcon from '~/assets/images/arrow-left-circle-line.svg';

  interface Props {
    icon?: 'add' | 'back';
    disabled?: boolean;
    classNames?: string;
    children: Snippet;
    onclick: () => void;
  }

  let { icon, disabled, children, onclick, classNames }: Props = $props();

  const icons: Record<NonNullable<Props["icon"]>, string> = {
    add: addIcon,
    back: backIcon,
  }
</script>

<button
  class={clsx(
    "font-bold flex items-center cursor-pointer ml-auto py-2 px-4 text-md border border-primary rounded-4xl text-primary",
    disabled && "opacity-50 cursor-not-allowed",
    classNames
  )}
  onclick={onclick}
>
  {#if icon}
    <img src={icons[icon]} alt={`${icon} icon`} class="w-4 h-4 mr-2">
  {/if}
  {@render children?.()}
</button>