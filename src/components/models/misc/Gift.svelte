<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { useGltf } from "@threlte/extras";
    import { Collider, RigidBody } from "@threlte/rapier";
    import { gameStore, audioManager } from "../../../lib/state/gameStore.svelte";
    import { dracoLoader } from "../../../lib/loaders/draco";
    import { basePath } from "../../../lib/utils/path";
    import * as THREE from "three";

    let { position } = $props();

    const gltf = useGltf(basePath("/models/misc/gift-transformed.glb"), {
        dracoLoader,
    });
    let ref = $state<THREE.Group>();
    let body = $state<any>();
    let scale = $state(0.6);
    let frames = 0;

    useTask((delta) => {
        if (ref) {
            const time = performance.now() / 1000;
            ref.position.y = Math.sin(time) * 0.1 + 2.5; // Legacy bobbing
            ref.rotation.x = Math.sin(time) * 0.1;
            ref.rotation.y += delta;
            ref.rotation.z = Math.sin(time) * 0.5;

            if (scale < 0.6 && frames > 0) {
                frames -= 1 * delta * 144;
            }
            if (frames <= 0) {
                scale = Math.min(scale + 0.5 * delta, 0.6);
                if (body) body.setEnabled(true);
            }
        }
    });

    const onIntersect = ({ other }: any) => {
        if (other.rigidBodyObject.name === "player") {
            gameStore.setItem();
            audioManager.play("turbo");
            scale = 0;
            frames = 400;
            if (body) body.setEnabled(false);
        }
    };
</script>

{#if $gltf}
    <T.Group {position}>
        <RigidBody type="fixed" bind:rigidBody={body}>
            <Collider
                shape="cuboid"
                args={[75, 75, 75]}
                sensor
                onsensorenter={onIntersect}
            />
        </RigidBody>
    </T.Group>

    <T.Group bind:ref {position} {scale}>
        <T.Mesh
            castShadow
            receiveShadow
            geometry={$gltf.nodes.Cube000.geometry}
            material={$gltf.materials.Material}
            position={[0.077, 0.5, -0.019]}
            rotation={[-Math.PI / 2, 0, 0]}
        />
        <T.Mesh
            castShadow
            receiveShadow
            geometry={$gltf.nodes.Cube000_1.geometry}
            material={$gltf.materials["Material.001"]}
            position={[0.077, 0.5, -0.019]}
            rotation={[-Math.PI / 2, 0, 0]}
        />
    </T.Group>
{/if}
