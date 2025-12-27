<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { useTexture } from '@threlte/extras'
  import * as THREE from 'three'

  let { position, item, timeModifier, color } = $props();

  const texture = useTexture('./particles/star_coin.png');
  let pointsRef = $state<THREE.Points>();
  let materialRef = $state<THREE.PointsMaterial>();
  let size = 1;
  let opacity = 1;
  let originalYpos = 0;
  let time = 0;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));

  $effect(() => {
    if (materialRef) {
      materialRef.color.multiplyScalar(6);
    }
  });

  $effect(() => {
    if (item && pointsRef) {
        size = 0;
        opacity = 1;
        pointsRef.position.x = Math.random() * 1 - 0.5;
        pointsRef.position.y = Math.random() * 0.5 - 0.25;
        originalYpos = pointsRef.position.y;
    }
  });

  useTask((delta) => {
    if (!pointsRef || !materialRef) return;
    time += delta;

    pointsRef.position.y += 0.008 * delta * 144;
    
    if (size < 1) {
      size = Math.min(size + 0.01 * delta * 144, 1);
    }

    if (pointsRef.position.y > originalYpos + 0.01) {
      opacity = Math.max(opacity - 0.01 * delta * 144, 0);
    } else {
      opacity = Math.abs(Math.sin(time * timeModifier * 20)); // Adjusted speed estimation
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
            {color}
        />
    </T.Points>
{/if}
