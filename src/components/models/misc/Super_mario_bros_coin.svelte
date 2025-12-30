<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { useGltf } from "@threlte/extras";
    import { RigidBody, Collider } from "@threlte/rapier";
    import { gameStore, audioManager } from "../../../lib/state/gameStore.svelte";
    import { dracoLoader } from "../../../lib/loaders/draco";
    import { basePath } from "../../../lib/utils/path";
    import * as THREE from "three";

    let { position } = $props();

    const gltf = useGltf(
        basePath("/models/misc/super_mario_bros_coin-transformed.glb"),
        {
            dracoLoader,
        },
    );
    let body = $state<any>();
    let mesh = $state<THREE.Mesh>();
    let scale = $state(0.426); // Legacy
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
            audioManager.play("jump");
            scale = 0;
            frames = 600;
            if (body) body.setEnabled(false);
        }
    };
</script>

{#if $gltf}
    <T.Group {position}>
        <RigidBody type="fixed" bind:rigidBody={body}>
            <Collider
                shape="ball"
                args={[0.5]}
                sensor
                onsensorenter={onIntersect}
            />
            <T.Mesh
                bind:ref={mesh}
                castShadow
                receiveShadow
                geometry={$gltf.nodes.Coin_CoinBlinn_0.geometry}
                material={$gltf.materials.CoinBlinn}
                {scale}
            />
        </RigidBody>
    </T.Group>
{/if}
