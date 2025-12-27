<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import * as THREE from 'three'

  let { turboColor, scale } = $props();

  let ref = $state<THREE.Mesh>();
  
  // State for velocity
  let velocity = {
    x: -Math.random() * 0.05,
    y: Math.random() * 0.05,
    z: Math.random() * 0.02,
  };
  const gravity = -0.003;

  useTask((delta) => {
    if(!ref) return;

    let position = ref.position;
    let velocityVector = new THREE.Vector3(velocity.x, velocity.y, velocity.z);
  
    // Adjust gravity and velocity based on delta
    velocity.y += gravity * delta * 144;
  
    // Scale velocity changes by delta
    position.x += velocity.x * delta * 144;
    position.y += velocity.y * delta * 144;
    position.z += velocity.z * delta * 144;
  
    if (!velocityVector.equals(new THREE.Vector3(0, 0, 0))) {
      const alignmentQuaternion = new THREE.Quaternion();
      alignmentQuaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), velocityVector.normalize());
      ref.quaternion.slerp(alignmentQuaternion, 0.1);
    }
  
    if (position.y < 0.05) {
      position.set(-0.6, 0.05, 0.5);
      velocity = {
        x: -Math.random() * 0.05,
        y: Math.random() * 0.05,
        z: Math.random() * 0.02,
      };
    }
  });

</script>

<T.Mesh bind:ref position={[-0.6, 0.05, 0.5]} scale={[scale, scale * 5, scale]}>
    <T.SphereGeometry args={[0.01, 16, 16]} />
    <T.MeshStandardMaterial
        emissive={turboColor}
        toneMapped={false}
        emissiveIntensity={5}
    />
</T.Mesh>
