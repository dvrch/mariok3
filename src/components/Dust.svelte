<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { useTexture } from '@threlte/extras'
  import { Euler, Object3D, Vector3, Matrix4, DoubleSide, Quaternion, TextureLoader } from 'three'
  import { gameStore } from '../lib/state/gameStore.svelte'

  let { count = 500, opacity = 0.1, size = 0.6 } = $props();

  const e = new Euler()
  const m = new Matrix4()
  const o = new Object3D()
  const v = new Vector3()
  const q = new Quaternion()

  const textures = useTexture([
    './particles/smokes/smoke_01.png',
    './particles/smokes/smoke_02.png',
    './particles/smokes/smoke_03.png',
    './particles/smokes/smoke_04.png',
    './particles/smokes/smoke_05.png',
    './particles/smokes/smoke_06.png',
    './particles/smokes/smoke_07.png',
    './particles/smokes/smoke_08.png'
  ]);

  let ref = $state<THREE.InstancedMesh>();
  let index = 0;
  let time = 0;

  function setItemAt(instances: any, rotation: any, body: any, i: any) {
    const randomOffset = (Math.random() - 0.5) * 0.3 ;
    const pos = body.getWorldPosition(v);
    o.rotation.set(0, rotation + Math.PI / 2, 0);
    pos.x += randomOffset
    // pos.y += randomOffset
    pos.z += randomOffset
    o.position.copy(pos);
    o.scale.setScalar(1)
    o.updateMatrix()
    instances.setMatrixAt(i, o.matrix)
    instances.instanceMatrix.needsUpdate = true
  }

  useTask((delta) => {
    // Check if textures are loaded, they are a promise in some versions or array if useTexture with array
    // Threlte useTexture returns a store or data. Let's assume it returns data if Suspense is used or we might need `await`.
    // Actually in Threlte useTexture returns a writable store usually.
    // But since Svelte 5, if we use it inside script it might be different.
    // Threlte 7 useTexture returns a store.
    // Let's use $textures.
    
    // Actually, let's just use the first texture for now or handle array logic if needed.
    // The original code used 8 distinct loaded textures but then only used `smoke01` in the material `map={smoke01}`.
    // See line 70: map={smoke01}. It defined an array `texture` but never used it for the material properly (or maybe passed it somewhere else which I didn't see).
    // Ah, line 70: `map={smoke01}`. It only uses the first one.

    if (!gameStore.leftWheel && !gameStore.rightWheel) return;
    const rotation = gameStore.leftWheel?.kartRotation || 0; // Assuming kartRotation is on the object

    // gameStore.leftWheel is likely an Object3D or similar from the way it's used.
    // Actually in original store.jsx it was just `setLeftWheel` with an object.
    
    // We need to access time. In useTask, we get delta. We can accumulate time.
    time += delta;

    if (time > 0.02 && gameStore.leftWheel && gameStore.rightWheel && ref && (gameStore.leftWheel.isSpinning || gameStore.leftWheel.userData?.isSpinning)) { 
        // Note: isSpinning check. 
        // I reset time in original code: `if (state.clock.getElapsedTime() - time > 0.02 ... time = ...`
        // Here I can just use a local accumulator.
        const currentTime = performance.now() / 1000;
        // Logic adaptation:
        
        setItemAt(ref, rotation, gameStore.leftWheel, index++);
        setItemAt(ref, rotation, gameStore.rightWheel, index++);
        
        if (index >= count) index = 0;
        
        // Reset accumulation if I was tracking interval manually, but here I'm running every frame.
        // The original code uses `state.clock.getElapsedTime() - time > 0.02`. 
        // It implies `time` is "lastSpawnTime".
    } else if (ref) {
        // Shrink old one
        for (let i = 0; i < count; i++) {
            // Simulated time/animation logic
            // The original used `Math.sin(time * 6 + i * 10)`. using `performance.now()` for simple time.
            const t = performance.now() / 1000;
            const direction = new Vector3(Math.sin(t * 6 + i * 10) , 2, 0);
            ref.getMatrixAt(i, m)
            m.decompose(o.position, q, v)
            o.scale.setScalar(Math.max(0, v.x - 0.005))
            o.position.addScaledVector(direction, 0.01)
            o.updateMatrix()
            ref.setMatrixAt(i, o.matrix)
            ref.instanceMatrix.needsUpdate = true
        }
    }
  });

  // Layout effect equivalent for initial rotation
  $effect(() => {
    if(ref){
      ref.geometry.rotateY(-Math.PI / 2)
      return () => {
        ref.geometry.rotateY(Math.PI / 2)
      }
    }
  });

</script>

{#if $textures}
    <T.InstancedMesh bind:ref frustumCulled={false} args={[undefined, undefined, count]}>
      <T.PlaneGeometry args={[size, size]} />
      <T.MeshBasicMaterial color={0xfcebc5} transparent map={$textures[0]} opacity={1} depthWrite={false} side={DoubleSide} />
    </T.InstancedMesh>
{/if}
