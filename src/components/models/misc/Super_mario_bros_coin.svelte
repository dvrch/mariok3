<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { useGltf, useDraco } from "@threlte/extras";
    import { RigidBody } from "@threlte/rapier";
    import { gameStore } from "../../../lib/state/gameStore.svelte";
    import * as THREE from "three";

    let { position = [0, 0, 0] } = $props();

    const dracoLoader = useDraco("https://www.gstatic.com/draco/v1/decoders/");
    const gltf = useGltf(
        "./models/misc/super_mario_bros_coin-transformed.glb",
        { dracoLoader },
    );
    let body = $state<any>();
    let mesh = $state<THREE.Mesh>();
    let scale = $state(0.424);
    let frames = 0;

    useTask((delta) => {
        if (mesh) {
            mesh.rotation.y += 4 * delta;
            if (scale < 0.424 && frames > 0) {
                frames -= 1 * delta * 144;
            }
            if (frames <= 0) {
                scale = Math.min(scale + 0.5 * delta, 0.424);
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
        sensor
        bind:ref={body}
        on:intersectionEnter={onIntersect}
        {position}
    >
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
