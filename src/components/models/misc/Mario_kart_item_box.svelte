<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { useGltf, Float, RoundedBox } from '@threlte/extras'
  import { RigidBody } from '@threlte/rapier'
  import { gameStore } from '../../../lib/state/gameStore.svelte'

  let { position = [0, 0, 0] } = $props();

</script>

<RigidBody 
    type="fixed" 
    name="itemBox"
    sensor
    onintersectionenter={() => {
        gameStore.setItem();
    }}
    {position}
>
    <T.Mesh>
        <T.BoxGeometry args={[1, 1, 1]} />
        <T.MeshStandardMaterial color="green" />
    </T.Mesh>
</RigidBody>

<T.Group {position} dispose={null}>
    <Float
        speed={2}
        rotationIntensity={20}
        floatIntensity={1}
        floatingRange={[1, 2]}
    >
        <T.Mesh>
            <T.BoxGeometry args={[1, 1, 1]} />
            <T.MeshBasicMaterial color="green" />
        </T.Mesh>
    </Float>
</T.Group>
