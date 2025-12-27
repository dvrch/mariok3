<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { useTexture } from '@threlte/extras'
  import * as THREE from 'three'

  let { position, shouldLaunch } = $props();

  const texture = useTexture('./particles/star_symbol.png');
  let pointsRef = $state<THREE.Points>();
  let materialRef = $state<THREE.PointsMaterial>();
  
  let size = $state(3);
  let frames = 50;
  
  const gravity = -0.03;
  let velocity = {
    x: (Math.random() - 0.5) * 33,
    y: (Math.random() + 0.3) * 4,
  };

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));

  $effect(() => {
    if (materialRef) {
      materialRef.color.multiplyScalar(15);
    }
  });

  $effect(() => {
    if (shouldLaunch && pointsRef) {
        pointsRef.position.set(0, 0, 0);
        velocity = {
          x: (Math.random() - 0.5) * 33,
          y: (Math.random() + 0.3) * 4,
        };
        if (materialRef) {
          materialRef.opacity = 1;
          materialRef.size = 3;
        }
        frames = 50;
    }
  });

  useTask((delta) => {
    if (!pointsRef) return;
    
    let pos = pointsRef.position;
    
    let t = 1 - Math.max(frames / 150, 0);
    let easeOutCubic = 1 - Math.pow(1 - t, 3);

    pos.x += velocity.x * delta * easeOutCubic;
    pos.y += velocity.y * delta * easeOutCubic;

    velocity.y += gravity * delta * 144;
    frames -= 1;

    if (materialRef) {
        materialRef.opacity = Math.abs(Math.sin(frames * 0.1));
        
        if (frames < 0 && materialRef.size > 0) {
             materialRef.size = Math.max((materialRef.size - 0.1 * delta * 144), 0);
        }
    }
  });
</script>

{#if $texture}
    <T.Points bind:ref={pointsRef} {geometry}>
        <T.PointsMaterial
            bind:ref={materialRef}
            {size}
            alphaMap={$texture}
            transparent={true}
            depthWrite={false}
            color={0xfafad2}
            opacity={1}
        />
    </T.Points>
{/if}
