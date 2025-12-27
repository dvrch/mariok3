<script lang="ts">
  import SmokeParticle from './SmokeParticle.svelte'

  let { driftRight, driftLeft } = $props();
</script>

<SmokeParticle
    position={[-0.6, 0.05, 0.5]}
    png="./particles/fire_02.png"
    leftDrift={driftLeft}
    rightDrift={driftRight}
    delay={200}
/>
<SmokeParticle
    position={[0.6, 0.05, 0.5]}
    png="./particles/fire_01.png"
    leftDrift={driftLeft}
    rightDrift={driftRight}
    delay={200}
/>
