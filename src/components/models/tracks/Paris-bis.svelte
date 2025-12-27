<script lang="ts">
    import { T } from "@threlte/core";
    import { useGltf } from "@threlte/extras";
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
    <!-- Legacy Scale Structure: group[scale=50] -> group[scale=0.01] -->
    <T.Group {position} scale={50} {...props}>
        <T.Group scale={0.01}>
            <!-- Visual City -->
            <T is={$gltf.scene} />

            <!-- Solid Road / Terrain (Legacy Position) -->
            {#if $gltf.nodes.ShadowCollision_M_Cmn_ShadowCollision_0}
                <RigidBody type="fixed">
                    <Collider
                        shape="trimesh"
                        args={[
                            (
                                $gltf.nodes
                                    .ShadowCollision_M_Cmn_ShadowCollision_0 as any
                            ).geometry.attributes.position.array,
                            (
                                $gltf.nodes
                                    .ShadowCollision_M_Cmn_ShadowCollision_0 as any
                            ).geometry.index.array,
                        ]}
                    />
                </RigidBody>
            {/if}
        </T.Group>
    </T.Group>
{/if}
