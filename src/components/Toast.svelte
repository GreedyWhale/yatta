<script lang="ts">
  import type { ToastConfig } from '~/store/toast';

  import { fly } from 'svelte/transition';
  import warningIcon from '~/assets/images/alert-fill.svg';
  import successIcon from '~/assets/images/checkbox-circle-fill.svg';
  import errorIcon from '~/assets/images/close-circle-fill.svg';
  import closeIcon from '~/assets/images/close-line.svg?no-inline';
  import infoIcon from '~/assets/images/information-2-fill.svg';

  import { dismissToast, toasts } from '~/store';

  function handleMouseEnter(toast: ToastConfig) {
    if (toast.pauseOnHover && toast.timer) {
      clearTimeout(toast.timer);
    }
  }

  function handleMouseLeave(toast: ToastConfig) {
    if (toast.pauseOnHover && toast.timer) {
      toast.timer = window.setTimeout(() => dismissToast(toast.id), toast.duration);
    }
  }

</script>

{#if $toasts}
  <div class="fixed z-50 top-0 left-1/2 -translate-x-1/2 mt-8">
    {#each $toasts as toast}
      <div
        in:fly={{y: -200, duration: 300}}
        out:fly={{y: 200, duration: 300}}
        class='w-80 flex items-start p-4 rounded-lg shadow-lg border bg-[#0F1A2E] text-white text-md'
        onmouseenter={() => handleMouseEnter(toast)}
        onmouseleave={() => handleMouseLeave(toast)}
        role="alert"
      >
        <img
          class="flex-none w-4 h-4 mr-4 mt-[1px]"
          src={
            toast.type === 'success'
              ? successIcon
              : toast.type === 'warning'
                ? warningIcon
                : toast.type === 'info'
                  ? infoIcon
                  : errorIcon
          }
          alt={toast.type}
        />
        <p class="flex-1 mr-2">{toast.message}</p>
        <button
          aria-label="dismiss toast"
          onclick={() => dismissToast(toast.id)}
          class="bg-no-repeat bg-center bg-cover w-4 h-4 cursor-pointer"
          style:background-image={`url(${closeIcon})`}
        >
        </button>
      </div>
    {/each}
  </div>
{/if}