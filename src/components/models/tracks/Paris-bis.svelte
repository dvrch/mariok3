<script lang="ts">
    import { T } from "@threlte/core";
    import { useGltf } from "@threlte/extras";
    import { RigidBody, AutoColliders } from "@threlte/rapier";
    import { dracoLoader } from "../../../lib/loaders/draco";

    let { position = [0, -3.6, 0] as [number, number, number], ...props } =
        $props();

    const gltf = useGltf("/models/tracks/paris-bis.glb", {
        dracoLoader,
    });

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
    <!-- Legacy Scale Structure: 50 * 0.01 = 0.5 -->
    <T.Group {position} scale={50} {...props}>
        <T.Group scale={0.01}>
            <!-- Visual City -->
            <T is={$gltf.scene} />

            <!-- Solid Road / Terrain -->
            {#if $gltf.nodes.ShadowCollision_M_Cmn_ShadowCollision_0}
                <RigidBody type="fixed">
                    <AutoColliders shape="trimesh">
                        <T.Mesh
                            geometry={$gltf.nodes
                                .ShadowCollision_M_Cmn_ShadowCollision_0
                                .geometry}
                            material={$gltf.materials.M_Cmn_ShadowCollision}
                            position={[0, 0.244, 0]}
                        />
                    </AutoColliders>
                </RigidBody>
            {/if}
        </T.Group>
    </T.Group>
{/if}
