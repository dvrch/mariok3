<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { useGltf } from "@threlte/extras";
    import { gameStore } from "../../../lib/state/gameStore.svelte";
    import gsap from "gsap";
    import * as THREE from "three";

    let {
        currentSpeed,
        steeringAngleWheels,
        isBoosting,
        shouldLaunch,
        ...props
    } = $props();

    const gltf = useGltf("./models/characters/mariokarttest.glb");

    let frontLeftWheel = $state<THREE.Mesh>();
    let frontRightWheel = $state<THREE.Mesh>();
    let rearWheels = $state<THREE.Mesh>();
    let frontWheels = $state<THREE.Group>();
    let marioGroup = $state<THREE.Group>();
    let boostScale = $state(1);

    useTask((delta) => {
        if (frontLeftWheel && frontRightWheel && rearWheels && frontWheels) {
            const rotation = currentSpeed / 100;
            frontLeftWheel.rotation.x += rotation;
            frontRightWheel.rotation.x += rotation;
            rearWheels.rotation.x += rotation;
            frontWheels.rotation.y = steeringAngleWheels;

            if (isBoosting) {
                boostScale = Math.min(boostScale + 0.05 * 144 * delta, 1);
            } else {
                boostScale = Math.max(boostScale - 0.03 * 144 * delta, 0);
            }
        }
    });

    $effect(() => {
        if (shouldLaunch && marioGroup) {
            gsap.to(marioGroup.rotation, {
                duration: 1.5,
                y: marioGroup.rotation.y + Math.PI * 3,
                onComplete: () => {
                    // Reset or keep rotation? Original says reset but then sets it to 0,0,0
                    // marioGroup.rotation.set(0, 0, 0);
                },
            });
        }
    });
</script>

{#if $gltf}
    <T.Group bind:ref={marioGroup} rotation={[0, Math.PI, 0]} {...props}>
        <T.Mesh
            castShadow
            receiveShadow
            geometry={$gltf.nodes.mt_kart_Mario_S.geometry}
            material={$gltf.materials.mt_kart_Mario_S}
        />
        <T.Mesh
            bind:ref={rearWheels}
            castShadow
            receiveShadow
            geometry={$gltf.nodes.mt_Kart_Mario_Tire_S001.geometry}
            material={$gltf.materials.mt_Kart_Mario_Tire_S}
            position={[0, 0.22, -0.347]}
        />
        <T.Group bind:ref={frontWheels}>
            <T.Mesh
                bind:ref={frontLeftWheel}
                castShadow
                receiveShadow
                geometry={$gltf.nodes.mt_Kart_Mario_Tire_S002.geometry}
                material={$gltf.materials.mt_Kart_Mario_Tire_S}
                position={[0.37, 0.193, 0.441]}
            />
            <T.Mesh
                bind:ref={frontRightWheel}
                castShadow
                receiveShadow
                geometry={$gltf.nodes.mt_Kart_Mario_Tire_S003.geometry}
                material={$gltf.materials.mt_Kart_Mario_Tire_S}
                position={[-0.37, 0.193, 0.441]}
                rotation={[-Math.PI, 0, 0]}
                scale={-1}
            />
        </T.Group>
        <T.Mesh
            castShadow
            receiveShadow
            geometry={$gltf.nodes.mt_mario.geometry}
            material={$gltf.materials.mt_mario}
        />

        <!-- Flames and effects could be added here similar to original -->
    </T.Group>
{/if}
