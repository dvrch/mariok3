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
    <!-- Unified Scale: 50 (to match Experience map scaling) -->
    <T.Group {position} scale={50} {...props}>
        <T.Group>
            <!-- Visual City -->
            <T is={$gltf.scene} />

            <!-- Solid Road / Terrain (Legacy Position) -->
            {#if $gltf.nodes.ShadowCollision_M_Cmn_ShadowCollision_0}
                <RigidBody type="fixed" colliders="trimesh">
                    <T
                        is={$gltf.nodes.ShadowCollision_M_Cmn_ShadowCollision_0}
                        position={[0, 0.244, 0]}
                    />
                </RigidBody>
            {/if}
        </T.Group>
    </T.Group>
{/if}
