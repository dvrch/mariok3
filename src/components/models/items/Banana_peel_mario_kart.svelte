<script lang="ts">
    import { T } from "@threlte/core";
    import { useGltf, useDraco } from "@threlte/extras";
    import { Collider, RigidBody } from "@threlte/rapier";
    import { gameStore } from "../../../lib/state/gameStore.svelte";
    import { dracoLoader } from "../../../lib/loaders/draco";
    import { basePath } from "../../../lib/utils/path";

    let { id, position, setNetworkBananas, networkBananas } = $props<{
        id: string;
        position: { x: number; y: number; z: number };
        setNetworkBananas?: (bananas: any[]) => void;
        networkBananas?: any[];
    }>();

    const gltf = useGltf(
        basePath("/models/items/banana_peel_mario_kart-transformed.glb"),
        { dracoLoader },
    );
    let scale = 0.002;

    const onIntersect = ({ other }: any) => {
        if (other.rigidBodyObject.name === "player") {
            gameStore.shouldSlowDown = true;
            if (setNetworkBananas && networkBananas) {
                setNetworkBananas(
                    networkBananas.filter((b: any) => b.id !== id),
                );
            } else {
                gameStore.removeBananaById(id);
            }
        }
    };
</script>

{#if $gltf}
    <T.Group position={[position.x, position.y, position.z]}>
        <RigidBody
            type="fixed"
            oncollisionenter={onIntersect}
            colliders={false}
            name="banana"
        >
            <Collider shape="ball" args={[0.5]} sensor /> // verif
        </RigidBody>
    </T.Group>

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
