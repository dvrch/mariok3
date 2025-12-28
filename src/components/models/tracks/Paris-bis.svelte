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
    <!-- Legacy Structure: Scale 50 at Top, Scene inside with trimesh colliders -->
    <T.Group {position} scale={50} {...props}>
        <RigidBody type="fixed">
            <AutoColliders shape="trimesh">
                <T.Group scale={0.01}>
                    <T is={$gltf.scene} />
                </T.Group>
            </AutoColliders>
        </RigidBody>
    </T.Group>
{/if}
