<script lang="ts">
  import clsx from "clsx";
  import type { Snippet } from'svelte';

  interface Props {
    id: number | string;
    children: Snippet;
    title: Snippet;
    classNames?: string;
  }

  let { classNames, children, title, id }: Props = $props();
</script>

<div class={clsx('', classNames)}>
  <canvas data-id={id}></canvas>
  <h3 class="text-xl font-semibold mb-2">
    {@render title()}
  </h3>
  {@render children?.()}
</div>