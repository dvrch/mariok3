<script lang="ts">
    import { T } from "@threlte/core";
    import { useGltf } from "@threlte/extras";
    import { RigidBody } from "@threlte/rapier";

    let { position = [0, -3.6, 0], ...props } = $props();

    const gltf = useGltf(
        "./models/tracks/tour_paris_promenade-transformed.glb",
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
        <T.Group scale={0.01}>
            {#each Object.entries($gltf.nodes) as [name, node]}
                {#if node.type === "Mesh" && name !== "ShadowCollision_M_Cmn_ShadowCollision_0"}
                    <T.Mesh
                        castShadow
                        receiveShadow
                        geometry={node.geometry}
                        material={node.material}
                        position={node.position}
                        rotation={node.rotation}
                        scale={node.scale}
                    />
                {/if}
            {/each}

            <RigidBody type="fixed" colliders="trimesh" name="terrain">
                <T.Mesh
                    castShadow
                    receiveShadow
                    geometry={$gltf.nodes
                        .ShadowCollision_M_Cmn_ShadowCollision_0.geometry}
                    material={$gltf.materials.M_Cmn_ShadowCollision}
                    position={[0, 0.244, 0]}
                />
            </RigidBody>
        </T.Group>
    </T.Group>
{/if}
