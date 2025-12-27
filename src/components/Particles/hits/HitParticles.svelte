<script lang="ts">
  import HitParticle from './HitParticle.svelte'

  let { position, shouldLaunch } = $props();
</script>

{#each Array(9) as _}
  <HitParticle {position} {shouldLaunch}/>
{/each}
