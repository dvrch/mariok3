<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { useGltf } from "@threlte/extras";
    import { RigidBody } from "@threlte/rapier";
    import { gameStore } from "../../../lib/state/gameStore.svelte";
    import { dracoLoader } from "../../../lib/loaders/draco";
    import * as THREE from "three";

    let { position } = $props();

    const gltf = useGltf("/models/misc/super_mario_bros_coin-transformed.glb", {
        dracoLoader,
    });
    let body = $state<any>();
    let mesh = $state<THREE.Mesh>();
    let scale = $state(21.2); // 0.424 * 50
    let frames = 0;

    useTask((delta) => {
        if (mesh) {
            mesh.rotation.y += 4 * delta;
            if (scale < 0.424 && frames > 0) {
                frames -= 1 * delta * 144;
            }
            if (frames <= 0) {
                scale = Math.min(scale + 25 * delta, 21.2);
                if (body) body.setEnabled(true);
            }
        }
    });

    const onIntersect = ({ other }: any) => {
        if (other.rigidBodyObject.name === "player") {
            gameStore.addCoins();
            scale = 0;
            frames = 600;
            if (body) body.setEnabled(false);
        }
    };
</script>

{#if $gltf}
    <RigidBody
        type="fixed"
        name="coin"
        bind:rigidBody={body}
        onintersectionenter={onIntersect}
        {position}
    >
        <Collider shape="ball" args={[25]} sensor />
        <T.Mesh
            bind:ref={mesh}
            castShadow
            receiveShadow
            geometry={$gltf.nodes.Coin_CoinBlinn_0.geometry}
            material={$gltf.materials.CoinBlinn}
            {scale}
        />
    </RigidBody>
{/if}
