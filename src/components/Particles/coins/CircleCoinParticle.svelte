<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { useTexture } from '@threlte/extras'
  import * as THREE from 'three'

  let { position, coins } = $props();

  const texture = useTexture('./particles/circle_coin.png');
  let size = $state(1);
  let opacity = $state(1);
  let materialRef = $state<THREE.PointsMaterial>();

  // Geometry creation
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));

  $effect(() => {
    if (materialRef) {
      materialRef.color.multiplyScalar(4);
    }
  });

  $effect(() => {
    // Reset on coins change
    // We need to track changes to coins prop.
    coins; 
    size = 0;
    opacity = 1;
  });

  useTask((delta) => {
    if (size < 5) {
      size = Math.min(size + 0.2 * delta * 144, 5);
    } else if (opacity > 0) {
      opacity = Math.max(opacity - 0.1 * delta * 144, 0);
      size = Math.max(size - 0.1 * delta * 144, 0);
    }
  });
</script>

{#if $texture}
    <T.Points {geometry}>
        <T.PointsMaterial
            bind:ref={materialRef}
            {size}
            alphaMap={$texture}
            transparent={true}
            depthWrite={false}
            {opacity}
            toneMapped={false}
            color={0xbf8717}
        />
    </T.Points>
{/if}
