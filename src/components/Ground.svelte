<script lang="ts">
    import { T } from "@threlte/core";
    import { RigidBody } from "@threlte/rapier";

    let { ...props } = $props();
</script>

<RigidBody type="fixed" {...props}>
    <T.Mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <T.PlaneGeometry args={[1000, 1000, 1000]} />
        <T.MeshStandardMaterial color="yellow" opacity={0} transparent />
    </T.Mesh>
</RigidBody>
