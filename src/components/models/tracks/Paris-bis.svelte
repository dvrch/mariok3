<script lang="ts">
    import { T } from "@threlte/core";
    import { useGltf } from "@threlte/extras";
    import { RigidBody, AutoColliders } from "@threlte/rapier";
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
    <!-- Unified Scale: 50 (to match Experience map scaling) -->
    <T.Group {position} scale={50} {...props}>
        <!-- Solid Road / Terrain (Legacy Position) - Outside of 0.01 scale to avoid Rapier issues -->
        {#if $gltf.nodes.ShadowCollision_M_Cmn_ShadowCollision_0}
            <RigidBody type="fixed">
                <AutoColliders shape="trimesh">
                    <!-- Scale the collider by 0.01 to match the visual mesh scale -->
                    <T
                        is={$gltf.nodes.ShadowCollision_M_Cmn_ShadowCollision_0}
                        position={[0, 0.244 * 0.01, 0]}
                        scale={0.01}
                    />
                </AutoColliders>
            </RigidBody>
        {/if}

        <T.Group scale={0.01}>
            <!-- Visual City -->
            <T is={$gltf.scene} />
        </T.Group>
    </T.Group>
{/if}
