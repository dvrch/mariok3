<script lang="ts">
    import { T } from "@threlte/core";
    import { useGltf, useDraco } from "@threlte/extras";
    import { RigidBody, Collider } from "@threlte/rapier";

    import { dracoLoader } from "../../../lib/loaders/draco";

    let { position = [0, -3.6, 0], ...props } = $props();

    const gltf = useGltf(
        "/models/tracks/tour_paris_promenade-transformed.glb",
        { dracoLoader },
    );

    $effect(() => {
        if ($gltf) {
            const materials = $gltf.materials;
            if (materials.M_Cmn_ShadowCollision) {
                materials.M_Cmn_ShadowCollision.opacity = 0;
                materials.M_Cmn_ShadowCollision.transparent = true;
            }
        }
    });
</script>

{#if $gltf}
    <T.Group {position} scale={50} {...props}>
        <RigidBody type="fixed">
            <T is={$gltf.scene} colliders="trimesh" />
        </RigidBody>
    </T.Group>
{/if}
