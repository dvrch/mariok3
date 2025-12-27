<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { useTexture } from '@threlte/extras'
  import * as THREE from 'three'

  let { position, coins, timeModifier } = $props();

  const texture = useTexture('./particles/star_coin.png');
  let materialRef = $state<THREE.PointsMaterial>();
  let pointsRef = $state<THREE.Points>();
  
  // Refs representing mutable state that doesn't necessarily trigger UI updates but is used in loop
  // Actually in Svelte 5 we can use just variables if we don't need reactivity outside
  // But for the logic:
  let size = 1;
  let opacity = 1;
  let originalYpos = 0;
  let time = 0;

  // Geometry creation
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));

  $effect(() => {
    if (materialRef) {
      materialRef.color.multiplyScalar(6);
    }
  });

  $effect(() => {
    // Reset on coins change
    coins;
    size = 0;
    opacity = 1;
    if(pointsRef) {
        pointsRef.position.x = Math.random() * 1 - 0.5;
        pointsRef.position.y = Math.random() * 0.5 - 0.25;
        originalYpos = pointsRef.position.y;
    }
  });

  useTask((delta) => {
    if(!pointsRef || !materialRef) return;
    
    time += delta;
    
    pointsRef.position.y += 0.008 * delta * 144;
    
    if (size < 1) {
      size = Math.min(size + 0.01 * delta * 144, 1);
    }

    if (pointsRef.position.y > originalYpos + 0.01) {
      opacity = Math.max(opacity - 0.01 * delta * 144, 0);
    } else {
      opacity = Math.abs(Math.sin(time * timeModifier * 1500)); 
      // Note: original code used state.clock.getElapsedTime(). 
      // Time here is accumulated delta. Might need absolute time.
      // Math.sin(time * timeModifier * 1500) seems very fast? 
      // If timeModifier is 50, then 50*1500 = 75000 rad/sec??
      // Maybe I should use performance.now()/1000
    }
    
    materialRef.size = size;
    materialRef.opacity = opacity;
  });
</script>

{#if $texture}
    <T.Points bind:ref={pointsRef} {geometry}>
        <T.PointsMaterial
            bind:ref={materialRef}
            alphaMap={$texture}
            transparent={true}
            depthWrite={false}
            toneMapped={false}
            color={0xbf8717}
        />
    </T.Points>
{/if}
