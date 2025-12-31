<script lang="ts">
    import { T, useLoader } from "@threlte/core";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

    let { position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] } = $props<{
        position?: [number, number, number];
        scale?: [number, number, number] | number;
        rotation?: [number, number, number];
    }>();

    const gltf = useLoader(GLTFLoader, "/models/misc/mario_kart_item_box.glb");
</script>

{#if gltf && gltf.scene}
    <T.Group {position} {scale} {rotation}>
        {#each gltf.scene.children as child (child.uuid)}
            {#if child.geometry && child.material}
                <T.Mesh 
                    geometry={child.geometry} 
                    material={child.material}
                    position={[child.position.x, child.position.y, child.position.z]}
                    rotation={[child.rotation.x, child.rotation.y, child.rotation.z]}
                    scale={[child.scale.x, child.scale.y, child.scale.z]}
                    castShadow
                    receiveShadow
                />
            {/if}
        {/each}
    </T.Group>
{/if}