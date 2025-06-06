<script lang="ts">
  import Calendar from '@/components/Calendar.svelte';
  import Toast from '@/components/Toast.svelte';
  import clsx from 'clsx';

  function handleCreate(date: string) {
    console.log('create', date);
  }
</script>

<main class="h-[100vh] bg-[linear-gradient(135deg,#e5e5e5_0%,#d0d8d8_25%,#b0c9c9_50%,#7ab0b0_75%,#2a8e8e_100%)]">
  <div class="w-full h-full py-4">
    <div class={clsx(
      "bg-white/30 backdrop-blur-xs rounded-lg border border-white/70 shadow-lg h-full mx-auto w-full",
      "xl:w-[1280px]"
    )}>
      <Calendar onCreate={handleCreate} />
    </div>
  </div>
</main>

<Toast />

