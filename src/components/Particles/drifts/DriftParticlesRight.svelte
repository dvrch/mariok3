<script lang="ts">
  import { T } from '@threlte/core'
  import Particles2 from './Particles2.svelte'

  let { turboColor, scale } = $props();
</script>

<T.Group>
  {#each Array(18) as _}
    <Particles2 {turboColor} {scale} />
  {/each}
</T.Group>
