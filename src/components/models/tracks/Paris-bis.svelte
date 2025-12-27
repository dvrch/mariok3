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
        <T is={$gltf.scene} scale={0.01}>
            {#snippet children({ ref }: { ref: any })}
                {@const collisionMesh =
                    $gltf.nodes.ShadowCollision_M_Cmn_ShadowCollision_0}
                {#if collisionMesh}
                    <RigidBody type="fixed" name="terrain">
                        <Collider
                            shape="trimesh"
                            args={[collisionMesh.geometry]}
                        />
                    </RigidBody>
                {/if}
            {/snippet}
        </T>
    </T.Group>
{/if}
