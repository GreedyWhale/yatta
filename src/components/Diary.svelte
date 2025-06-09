<script lang="ts">
  import Button from '~/components/Button.svelte';
  import Card from '~/components/Card.svelte';

  interface Props {
    date: string;
    onBack: () => void;
  }

  let { date, onBack }: Props = $props();
</script>

<Button onclick={onBack} icon='back' classNames="mb-4">Back</Button>

<div>
  <h2>{date}</h2>
  <Card id="">
    {#snippet title()}
      test date
    {/snippet}
    card
  </Card>
</div>

