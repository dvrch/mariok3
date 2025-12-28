<script lang="ts">
    import { T } from "@threlte/core";
    import { useGltf } from "@threlte/extras";
    import { RigidBody, AutoColliders } from "@threlte/rapier";
    import { basePath } from "../../../lib/utils/path";
    import { dracoLoader } from "../../../lib/loaders/draco";

    let { position = [0, -3.6, 0] as [number, number, number], ...props } =
        $props();

    // const gltf = useGltf(basePath("/models/tracks/paris-bis.glb"), {
    //     dracoLoader,
    // });
    const gltf = useGltf(
        basePath("/models/tracks/tour_paris_promenade-transformed.glb"),
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
    <!-- Legacy Structure: Scale 50 at Top, Scene inside matches scale 50 world -->
    <!-- Force world position [0, -3.6, 0] when Experience passes [0,0,0] to match React -->
    <!-- Unified Scale: 50 (to match Experience map scaling and points) -->
    <T.Group {position} scale={50} {...props}>
        <RigidBody type="fixed">
            <AutoColliders shape="trimesh">
                <T is={$gltf.scene} />
            </AutoColliders>
        </RigidBody>
    </T.Group>
{/if}
