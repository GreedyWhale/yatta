<script lang="ts">
  import { liveQuery } from "dexie";

  import { db } from '~/utils/db';

  const notes = liveQuery(() => db.notes.toArray());
  console.log('Notes:', $notes);
</script>

<main>
  
</main>

