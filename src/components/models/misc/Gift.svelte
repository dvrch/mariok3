<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { useGltf } from "@threlte/extras";
    import { Collider, RigidBody } from "@threlte/rapier";
    import { gameStore } from "../../../lib/state/gameStore.svelte";
    import { dracoLoader } from "../../../lib/loaders/draco";
    import * as THREE from "three";

    let { position } = $props();

    const gltf = useGltf("/models/misc/gift-transformed.glb", { dracoLoader });
    let ref = $state<THREE.Group>();
    let body = $state<any>();
    let scale = $state(30); // 0.6 * 50
    let frames = 0;

    useTask((delta) => {
        if (ref) {
            const time = performance.now() / 1000;
            ref.position.y = Math.sin(time) * 5 + 11; // 0.1 * 50 + offset
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
            scale = 0;
            frames = 400;
            if (body) body.setEnabled(false);
        }
    };
</script>

{#if $gltf}
    <RigidBody
        type="fixed"
        bind:rigidBody={body}
        {position}
        colliders={false}
        userData={{ name: "gift" }}
    >
        <Collider
            shape="cuboid"
            args={[75, 75, 75]}
            sensor
            onsensorenter={onIntersect}
        />
    </RigidBody>

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
