<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { useGltf, useDraco } from "@threlte/extras";
    import { Collider, RigidBody } from "@threlte/rapier";
    import { onMount } from "svelte";
    import { gameStore } from "../../../lib/state/gameStore.svelte";
    import * as THREE from "three";
    import { dracoLoader } from "../../../lib/loaders/draco";
    import { basePath } from "../../../lib/utils/path";

    let { id, position, rotation, setNetworkShells, networkShells } = $props<{
        id: string;
        position: { x: number; y: number; z: number };
        rotation: number;
        setNetworkShells?: (shells: any[]) => void;
        networkShells?: any[];
    }>();

    const gltf = useGltf(basePath("/models/items/mario_shell_red.glb"), {
        dracoLoader,
    });
    let rigidBody = $state<any>();
    let mesh = $state<THREE.Mesh>();

    const shell_speed = 100;

    onMount(() => {
        if (rigidBody) {
            const velocity = {
                x: -Math.sin(rotation) * shell_speed,
                y: 0,
                z: -Math.cos(rotation) * shell_speed,
            };
            rigidBody.setLinvel(velocity, true);
        }
    });

    useTask((delta) => {
        if (rigidBody && mesh) {
            const pos = rigidBody.translation();
            mesh.position.set(pos.x, pos.y, pos.z);
            mesh.rotation.z += 0.2 * delta * 144;
        }
    });

    const onCollide = ({ other }: any) => {
        if (other.rigidBodyObject.name === "player") {
            gameStore.shouldSlowDown = true;
            if (setNetworkShells && networkShells) {
                setNetworkShells(networkShells.filter((s) => s.id !== id));
            } else {
                // Handle local removal
            }
        }
    };
</script>

{#if $gltf}
    <T.Group>
        <RigidBody
            bind:ref={rigidBody}
            type="dynamic"
            position={[position.x, position.y, position.z]}
            name="shell"
            colliders={false}
            oncollisionenter={onCollide}
        >
            <Collider shape="ball" args={[0.5]} />
        </RigidBody>
        <T.Mesh
            bind:ref={mesh}
            geometry={$gltf.nodes.defaultMaterial.geometry}
            material={$gltf.materials.Shell}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.6}
        />
    </T.Group>
{/if}
