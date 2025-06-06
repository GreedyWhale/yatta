<script lang="ts">
  import { clsx } from 'clsx';
  import { format, isAfter } from 'date-fns';

  import addIcon from '~/assets/images/add-line.svg';
  import arrowLeftIcon from '~/assets/images/arrow-left-circle-fill.svg';
  import arrowRightIcon from '~/assets/images/arrow-right-circle-fill.svg';
  import pushpin from '~/assets/images/pushpin-line.svg';

  import { addToast } from '~/store';

  interface Props {
    onCreate: (date: string) => void;
  }

  let { onCreate } = $props();

  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dateFormat = 'yyyy-MM-dd';

  let selectedDate = $state('');
  let date = $state(new Date());
  const currentDate = $derived.by(() => {
    const _date = selectedDate || date;
    return {
      month: format(_date, 'MMMM'),
      year: format(_date, 'yyyy'),
      day: format(_date, 'dd'),
      week: format(_date, 'eeee'),
    }
  });
  const datePanel = $derived(getCalendarDays(date.getFullYear(), date.getMonth()));
  const canCreate = $derived.by(() => {
    if (selectedDate) {
      return !isAfter(new Date(selectedDate), new Date());
    }

    return true;
  });

  function getCalendarDays(year: number, month: number) {
    const days: { day: number, monthOffset: -1 | 0 | 1, date: string; }[] = [];
    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    // 上月补齐
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        monthOffset: -1,
        date: format(new Date(year, month - 1, prevMonthLastDay - i), dateFormat)
      });
    }
    // 本月
    for (let i = 1; i <= lastDay; i++) {
      days.push({
        day: i,
        monthOffset: 0,
        date: format(new Date(year, month, i), dateFormat)
      });
    }
    // 下月补齐
    while (days.length < 42) {
      days.push({
        day: days.length - (firstDay + lastDay) + 1,
        monthOffset: 1,
        date: format(new Date(year, month + 1, days.length - (firstDay + lastDay) + 1), dateFormat)
      });
    }
    return days;
  }

  function changeMonth(action: 'prev'|'next') {
    const nextMonth = action === 'prev'? date.getMonth() - 1 : date.getMonth() + 1;
    date = new Date(date.setMonth(nextMonth));
  }

  function isCurrentDay(date: string) {
    return format(new Date(), dateFormat) === date;
  }

  function selectDate (dateInfo: typeof datePanel[number]) {
    selectedDate = selectedDate === dateInfo.date ? '' : dateInfo.date;
  }

  function backToToday() {
    selectedDate = format(new Date(), dateFormat);
    date = new Date();
  }

  function createDiary() {
    if (!canCreate) {
      addToast({
        message: 'You are attempting to create a journal entry from the future. We cannot allow you to tamper with the timeline.',
        type: 'error'
      });

      return;
    }

    onCreate(selectedDate || format(date, dateFormat));
  }
</script>


<div class="p-12">
  <div class="mb-8">
    <button
      class={clsx(
        "font-bold flex items-center cursor-pointer ml-auto py-2 px-4 text-md border border-primary rounded-4xl text-primary",
        !canCreate && "opacity-50 cursor-not-allowed"
      )}
      onclick={createDiary}
    >
      <img src={addIcon} alt="Add diary" class="w-4 h-4 mr-2">
      Create a diary
    </button>
  </div>
  <div class="flex">
    <div class="flex-none w-[35%]">
      <div class="text-5xl mb-4">
        <span>{currentDate.month}</span>
        <span class="text-gray-500">{currentDate.year}</span>
      </div>
      <div class="text-7xl mb-4 font-Fredericka_the_Great">{currentDate.day}</div>
      <div class="text-5xl">{currentDate.week}</div>
    </div>
    <div class="flex-1 mt-8">
      <div class="flex items-center justify-end mb-8">
        <button
          class="cursor-pointer mr-8 text-lg"
          onclick={backToToday}>
          Back To Today
        </button>
        <button class="cursor-pointer" onclick={() => changeMonth('prev')}>
          <img src={arrowLeftIcon} alt="Arrow left" class="w-8 h-8 mr-4">
        </button>
        <button class="cursor-pointer" onclick={() => changeMonth('next')}>
          <img src={arrowRightIcon} alt="Arrow right" class="w-8 h-8">
        </button>
      </div>

      <ol class="flex items-center text-2xl mb-8">
        {#each days as day }
          <li class="flex-1 text-center">{day}</li>
        {/each}
      </ol>

      <ol class="grid grid-cols-7 grid-rows-6 text-lg border-b border-r border-gray-500">
        {#each datePanel as item}
          <li class="relative">
            <button
              onclick={() => selectDate(item)}
              class={clsx(
                "flex items-start justify-start w-full p-2 cursor-pointer h-22 border-t border-l border-gray-500",
                item.monthOffset === 0 ? "text-black" : "text-gray-500",
              )}
            >
              <span
                class={clsx(
                  "relative",
                  isCurrentDay(item.date) && 'after:content-[""] after:absolute after:left-0 after:top-full after:w-8 after:h-[2px] after:bg-primary',
                )}
              >
                {item.day}
              </span>
              {#if selectedDate === item.date}
                <img src={pushpin} alt="pin" class="absolute bottom-2 right-2 w-4 h-4">
              {/if}
            </button>
          </li>
        {/each}
      </ol>
    </div>
  </div>
</div>