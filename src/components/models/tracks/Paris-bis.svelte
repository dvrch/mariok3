<script lang="ts">
    import { T } from "@threlte/core";
    import { useGltf, useDraco } from "@threlte/extras";
    import { RigidBody } from "@threlte/rapier";

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
        <T is={$gltf.scene} scale={0.01}>
            {#snippet children({ ref })}
                {@const collisionMesh =
                    $gltf.nodes.ShadowCollision_M_Cmn_ShadowCollision_0}
                {#if collisionMesh}
                    <RigidBody type="fixed" collider="trimesh" name="terrain">
                        <T.Mesh
                            geometry={collisionMesh.geometry}
                            material={$gltf.materials.M_Cmn_ShadowCollision}
                            position={[0, 0.244, 0]}
                        />
                    </RigidBody>
                {/if}
            {/snippet}
        </T>
    </T.Group>
{/if}
