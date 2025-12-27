<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { useTexture } from '@threlte/extras'
  import * as THREE from 'three'

  let { position, png, isBoosting, delay = 0 } = $props();

  const texture = useTexture(png);
  let pointsRef = $state<THREE.Points>();
  let initialized = false;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));

  $effect(() => {
    const timer = setTimeout(() => {
      initialized = true;
    }, delay);
    return () => clearTimeout(timer);
  });

  useTask((delta) => {
    if (!initialized || !pointsRef) return;

    if (isBoosting) {
      pointsRef.position.y += 0.03 * delta * 144;
      pointsRef.position.z += 0.06 * delta * 144;

      // Note: accessing material on pointsRef might need casting or check
      const material = pointsRef.material as THREE.PointsMaterial;

      if(pointsRef.position.y > 0.4) {
        pointsRef.position.y = 0;
        pointsRef.position.z = 0;
        material.opacity = 1;
      }
    
      if(material.opacity > 0) {
        material.opacity -= 0.05 * delta * 144;
      }
    } else {
      pointsRef.position.y = 0;
      pointsRef.position.z = 0;
      const material = pointsRef.material as THREE.PointsMaterial;
      material.opacity = 0;
    }
  });
</script>

{#if $texture}
    <T.Points bind:ref={pointsRef} {geometry}>
        <T.PointsMaterial
            size={1}
            alphaMap={$texture}
            transparent={true}
            depthWrite={false}
            color={0xff9900}
            opacity={1}
            toneMapped={false}
        />
    </T.Points>
{/if}
