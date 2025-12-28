<script lang="ts">
    import { T } from "@threlte/core";
    import { useGltf } from "@threlte/extras";
    import { RigidBody, AutoColliders } from "@threlte/rapier";
    import { dracoLoader } from "../../../lib/loaders/draco";

    let { position = [0, -3.6, 0] as [number, number, number], ...props } =
        $props();

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
    <!-- Unified Scale: 50 (to match Experience map scaling and points) -->
    <T.Group {position} scale={50} {...props}>
        <RigidBody type="fixed">
            <AutoColliders shape="trimesh">
                <T is={$gltf.scene} />
            </AutoColliders>
        </RigidBody>
    </T.Group>
{/if}
