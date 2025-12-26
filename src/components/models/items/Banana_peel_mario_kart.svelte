<script lang="ts">
    import { T } from "@threlte/core";
    import { useGltf } from "@threlte/extras";
    import { BallCollider, RigidBody } from "@threlte/rapier";
    import { gameStore } from "../../../lib/state/gameStore.svelte";

    let { id, position, setNetworkBananas, networkBananas } = $props<{
        id: string;
        position: { x: number; y: number; z: number };
        setNetworkBananas?: (bananas: any[]) => void;
        networkBananas?: any[];
    }>();

    const gltf = useGltf(
        "./models/items/banana_peel_mario_kart-transformed.glb",
    );
    let scale = 0.002;

    const onIntersect = ({ other }: any) => {
        if (other.rigidBodyObject.name === "player") {
            gameStore.shouldSlowdown = true;
            if (setNetworkBananas && networkBananas) {
                setNetworkBananas(networkBananas.filter((b) => b.id !== id));
            } else {
                gameStore.removeBananaById(id);
            }
        }
    };
</script>

{#if $gltf}
    <RigidBody
        type="fixed"
        sensor
        position={[position.x, position.y, position.z]}
        on:intersectionEnter={onIntersect}
        colliders={false}
        name="banana"
    >
        <BallCollider args={[0.5]} />
    </RigidBody>

    <T.Group position={[position.x, position.y, position.z]} {scale}>
        <T.Mesh
            castShadow
            receiveShadow
            geometry={$gltf.nodes["Banana_Peel_02_-_Default_0"].geometry}
            material={$gltf.materials["02_-_Default"]}
            position={[39.973, -25.006, -0.017]}
            rotation={[-Math.PI / 2, 0, 0]}
        />
        <T.Mesh
            castShadow
            receiveShadow
            geometry={$gltf.nodes["Banana_Peel_07_-_Default_0"].geometry}
            material={$gltf.materials["07_-_Default"]}
            position={[39.973, -25.006, -0.017]}
            rotation={[-Math.PI / 2, 0, 0]}
        />
        <T.Mesh
            castShadow
            receiveShadow
            geometry={$gltf.nodes["Banana_Peel_03_-_Default_0"].geometry}
            material={$gltf.materials["03_-_Default"]}
            position={[39.973, -25.006, -0.017]}
            rotation={[-Math.PI / 2, 0, 0]}
        />
    </T.Group>
{/if}
