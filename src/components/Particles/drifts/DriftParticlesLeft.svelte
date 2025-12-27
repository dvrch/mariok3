<script lang="ts">
  import { T } from '@threlte/core'
  import Particles1 from './Particles1.svelte'

  let { turboColor, scale } = $props();
</script>

<T.Group>
  {#each Array(18) as _}
    <Particles1 {turboColor} {scale} />
  {/each}
</T.Group>
