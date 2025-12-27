<script lang="ts">
  import { T } from '@threlte/core'
  import FlameParticle from './FlameParticle.svelte'

  let { isBoosting } = $props();
</script>

<T.Group>
  <!-- bottom left -->
  <T.Group position={[-0.26, 0.45, 1]}>
    <FlameParticle position={[0, 0, 0]} png="./fire_01.png" {isBoosting} delay={0} />
    <FlameParticle position={[0, 0, 0]} png="./fire_02.png" {isBoosting} delay={100} />
    <FlameParticle position={[0, 0, 0]} png="./fire_01.png" {isBoosting} delay={200} />
    <FlameParticle position={[0, 0, 0]} png="./fire_02.png" {isBoosting} delay={300} />
    <FlameParticle position={[0, 0, 0]} png="./fire_02.png" {isBoosting} delay={400} />
    <FlameParticle position={[0, 0, 0]} png="./fire_01.png" {isBoosting} delay={500} />
  </T.Group>

  <!-- bottom right -->
  <T.Group position={[0.26, 0.45, 1]}>
    <FlameParticle position={[0, 0, 0]} png="./fire_01.png" {isBoosting} delay={0} />
    <FlameParticle position={[0, 0, 0]} png="./fire_02.png" {isBoosting} delay={100} />
    <FlameParticle position={[0, 0, 0]} png="./fire_01.png" {isBoosting} delay={200} />
    <FlameParticle position={[0, 0, 0]} png="./fire_02.png" {isBoosting} delay={300} />
    <FlameParticle position={[0, 0, 0]} png="./fire_01.png" {isBoosting} delay={400} />
    <FlameParticle position={[0, 0, 0]} png="./fire_02.png" {isBoosting} delay={500} />
  </T.Group>

  <!-- top left -->
  <T.Group position={[-0.18, 0.6, 0.8]}>
    <FlameParticle position={[0, 0, 0]} png="./fire_02.png" {isBoosting} delay={0} />
    <FlameParticle position={[0, 0, 0]} png="./fire_01.png" {isBoosting} delay={100} />
    <FlameParticle position={[0, 0, 0]} png="./fire_02.png" {isBoosting} delay={200} />
    <FlameParticle position={[0, 0, 0]} png="./fire_01.png" {isBoosting} delay={300} />
    <FlameParticle position={[0, 0, 0]} png="./fire_02.png" {isBoosting} delay={400} />
    <FlameParticle position={[0, 0, 0]} png="./fire_01.png" {isBoosting} delay={500} />
  </T.Group>

  <!-- top right -->
  <T.Group position={[0.18, 0.6, 0.8]}>
    <FlameParticle position={[0, 0, 0]} png="./fire_02.png" {isBoosting} delay={0} />
    <FlameParticle position={[0, 0, 0]} png="./fire_01.png" {isBoosting} delay={100} />
    <FlameParticle position={[0, 0, 0]} png="./fire_02.png" {isBoosting} delay={200} />
    <FlameParticle position={[0, 0, 0]} png="./fire_01.png" {isBoosting} delay={300} />
    <FlameParticle position={[0, 0, 0]} png="./fire_02.png" {isBoosting} delay={400} />
    <FlameParticle position={[0, 0, 0]} png="./fire_01.png" {isBoosting} delay={500} />
  </T.Group>
</T.Group>
