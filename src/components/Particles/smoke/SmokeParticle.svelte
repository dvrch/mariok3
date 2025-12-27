<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { useTexture } from '@threlte/extras'
  import * as THREE from 'three'

  let { position, png, leftDrift, rightDrift, delay = 0 } = $props();

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

    if(leftDrift || rightDrift){
      pointsRef.position.z += 0.1 * delta * 144;
      const material = pointsRef.material as THREE.PointsMaterial;

      //Set inclination
      if(leftDrift){
        pointsRef.position.x -= 0.09 * delta * 144;
      }

      if(rightDrift){
        pointsRef.position.x += 0.09 * delta * 144;
      }

      if(pointsRef.position.x < -1.8 || pointsRef.position.x > 1.8) {
        pointsRef.position.z = 0;
        pointsRef.position.x = 0;
        material.opacity = 1.5;
        material.size = 4;
      }
    
      if(material.opacity > 0) {
        material.opacity -= 0.01 * delta * 144;
      }

      if(material.size > 0) {
        //Shrinking effect
        material.size -= 0.1* delta * 144;
      }

    } else {
      pointsRef.position.z = 0;
      pointsRef.position.x = 0;
      const material = pointsRef.material as THREE.PointsMaterial;
      material.opacity = 0;
      material.size = 0;
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
            color={0xBFBFBF}
            opacity={1}
            toneMapped={false}
        />
    </T.Points>
{/if}
