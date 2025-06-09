<script lang="ts">
  import clsx from 'clsx';
  import Calendar from '~/components/Calendar.svelte';
  import Diary from '~/components/Diary.svelte';
  import Toast from '~/components/Toast.svelte';

  let selectedDate = $state('');
  const visibleCalendar = $derived(!selectedDate);
</script>

<main class="h-[100vh] bg-[linear-gradient(135deg,#e5e5e5_0%,#d0d8d8_25%,#b0c9c9_50%,#7ab0b0_75%,#2a8e8e_100%)]">
  <div class="w-full h-full py-4">
    <div class={clsx(
      "p-12 bg-white/30 backdrop-blur-xs rounded-lg border border-white/70 shadow-lg h-full mx-auto w-full",
      "xl:w-[1280px]"
    )}>
      {#if visibleCalendar}
        <Calendar onCreate={date => selectedDate = date} />
      {:else}
        <Diary date={selectedDate} onBack={() => selectedDate = ''} />
      {/if}
    </div>
  </div>
</main>

<Toast />

