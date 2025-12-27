<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { useTexture } from '@threlte/extras'
  import * as THREE from 'three'

  let { position, item, color } = $props();

  const texture = useTexture('./particles/circle_coin.png');
  let materialRef = $state<THREE.PointsMaterial>();
  let size = $state(1);
  let opacity = $state(1);
  let currentColor = $state(color);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));

  $effect(() => {
    if (materialRef) {
      materialRef.color.multiplyScalar(4);
    }
  });

  $effect(() => {
    if (item) {
        size = 0;
        opacity = 1;
    }
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
            color={currentColor}
        />
    </T.Points>
{/if}
