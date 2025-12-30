<script lang="ts">
    import { T, useLoader } from "@threlte/core";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

    let { position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] } = $props<{
        position?: [number, number, number];
        scale?: [number, number, number] | number;
        rotation?: [number, number, number];
    }>();

    const gltf = useLoader(GLTFLoader, "/models/misc/gift-transformed.glb");
</script>

{#if gltf}
    <T.Group {position} {scale} {rotation}>
        <T.Primitive object={gltf.scene} />
    </T.Group>
{/if}