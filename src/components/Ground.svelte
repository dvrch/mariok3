<script lang="ts">
    import { T } from "@threlte/core";
    import { RigidBody, Collider } from "@threlte/rapier";

    let { ...props } = $props();
</script>

<RigidBody type="fixed" {...props}>
    <!-- Collider pour la physique - un cuboid plat pour le sol -->
    <Collider shape="cuboid" args={[500, 0.1, 500]} />
    <!-- Mesh visuel -->
    <T.Mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <T.PlaneGeometry args={[1000, 1000, 1000]} />
        <T.MeshStandardMaterial color="yellow" opacity={0} transparent />
    </T.Mesh>
</RigidBody>
