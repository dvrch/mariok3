<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { Euler, Object3D, Vector3, Matrix4, DoubleSide } from 'three'
  import { gameStore } from '../lib/state/gameStore.svelte'

  let { count = 50000, opacity = 0.5, size = 0.3 } = $props();

  const e = new Euler()
  const m = new Matrix4()
  const o = new Object3D()
  const v = new Vector3()

  let ref = $state<THREE.InstancedMesh>();
  let index = 0;

  function setItemAt(instances: any, rotation: any, body: any, i: any) {
    o.position.copy(body.getWorldPosition(v));
    o.rotation.set(0, rotation, 0);
    o.scale.setScalar(1)
    o.updateMatrix()
    instances.setMatrixAt(i, o.matrix)
    instances.instanceMatrix.needsUpdate = true
  }

  useTask(() => {
    if(!gameStore.leftWheel && !gameStore.rightWheel) return;
    const rotation = gameStore.leftWheel?.kartRotation || 0;

    if (gameStore.leftWheel && gameStore.rightWheel && ref && (gameStore.leftWheel.isSpinning || gameStore.rightWheel.isSpinning)) {
      setItemAt(ref, rotation, gameStore.leftWheel, index++);
      setItemAt(ref, rotation, gameStore.rightWheel, index++);
      
      if (index >= count) index = 0
    }
  });

  $effect(() => {
    if(ref){
      ref.geometry.rotateX(-Math.PI / 2)
      return () => {
        ref.geometry.rotateX(Math.PI / 2)
      }
    }
  });
</script>

<T.InstancedMesh bind:ref frustumCulled={false} args={[undefined, undefined, count]}>
    <T.PlaneGeometry args={[size, size]} />
    <T.MeshBasicMaterial color="black" side={DoubleSide} transparent {opacity} />
</T.InstancedMesh>
