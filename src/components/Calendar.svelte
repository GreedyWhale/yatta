<script lang="ts">
  const months = [
    'January', 'February', 'March',
    'April', 'May', 'June',
    'July', 'August', 'September',
    'October', 'November', 'December'
  ];

  const week = [
    'Sunday', 'Monday', 'Tuesday',
    'Wednesday', 'Thursday', 'Friday',
    'Saturday'
  ];

  const currentMouth = $state(new Date().getMonth());
  const currentYear = $state(new Date().getFullYear());

</script>

<div class="p-12">
  <div class="h-12">
    <button class="mb-8 cursor-pointer ml-auto block py-2 px-8 text-md border border-primary rounded-4xl text-primary">
      Create
    </button>
  </div>
  <div class="flex items-center justify-between">
    <div class="font-amaticSC text-5xl font-bold">
      <span>{months[currentMouth]}</span>
      <span class="text-gray-500">{currentYear}</span>
      
    </div>
  </div>
</div>