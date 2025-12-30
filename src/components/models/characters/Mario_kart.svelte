<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { useGltf } from "@threlte/extras";
    import { dracoLoader } from "../../../lib/loaders/draco";
    import { basePath } from "../../../lib/utils/path";
    import * as THREE from "three";
    import gsap from "gsap";
    import FakeGlowMaterial from "../../ShaderMaterials/FakeGlow/FakeGlowMaterial.svelte";
    import FakeFlame from "../../ShaderMaterials/FakeFlame/FakeFlame.svelte";

    let {
        currentSpeed = 0,
        steeringAngleWheels = 0,
        isBoosting = false,
        shouldLaunch = false,
        ...props
    } = $props();

    const gltf = useGltf(basePath("/models/characters/mariokarttest.glb"), {
        dracoLoader,
    });

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
        {#each Object.entries($gltf.nodes) as [name, node]}
            {@const mesh = node as THREE.Mesh}
            {#if mesh.type === "Mesh" && name !== "ShadowCollision_M_Cmn_ShadowCollision_0" && name !== "mt_Kart_Mario_Tire_S001" && name !== "mt_Kart_Mario_Tire_S002" && name !== "mt_Kart_Mario_Tire_S003" && name !== "mt_mario" && name !== "mt_kart_Mario_S" && name !== "Shadow_M_Kart_Mario_Shadow_0"}
                <T.Mesh
                    castShadow
                    receiveShadow
                    geometry={mesh.geometry}
                    material={mesh.material}
                    position={[
                        mesh.position.x,
                        mesh.position.y,
                        mesh.position.z,
                    ]}
                    rotation={[
                        mesh.rotation.x,
                        mesh.rotation.y,
                        mesh.rotation.z,
                    ]}
                    scale={[mesh.scale.x, mesh.scale.y, mesh.scale.z]}
                />
            {/if}
        {/each}

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
            geometry={$gltf.nodes.mt_kart_Mario_S.geometry}
            material={$gltf.materials.mt_kart_Mario_S}
        />
        <T.Mesh
            castShadow
            receiveShadow
            geometry={$gltf.nodes.mt_mario.geometry}
            material={$gltf.materials.mt_mario}
        />

        <T.Group position={[0, 0.6, -1.2]} scale={boostScale * 1.2}>
            <T.Mesh>
                <T.SphereGeometry args={[0.05, 16, 16]} />
                <FakeGlowMaterial />
            </T.Mesh>
        </T.Group>

        <!-- Exhausts -->
        <T.Group
            position={[0.3, 0.65, -1.35]}
            rotation={[Math.PI / 1.5, 0, 0]}
            scale={boostScale}
        >
            <T.Mesh>
                <T.CylinderGeometry args={[0.1, 0, 1, 128, 64, true]} />
                <FakeFlame {isBoosting} />
            </T.Mesh>
        </T.Group>
        <T.Group
            position={[-0.3, 0.65, -1.35]}
            rotation={[Math.PI / 1.5, 0, 0]}
            scale={boostScale}
        >
            <T.Mesh>
                <T.CylinderGeometry args={[0.1, 0, 1, 128, 64, true]} />
                <FakeFlame {isBoosting} />
            </T.Mesh>
        </T.Group>
        <T.Group
            position={[0.18, 0.75, -1.1]}
            rotation={[Math.PI / 1.5, 0, 0]}
            scale={boostScale * 0.8}
        >
            <T.Mesh>
                <T.CylinderGeometry args={[0.09, 0, 1, 128, 64, true]} />
                <FakeFlame {isBoosting} />
            </T.Mesh>
        </T.Group>

        <!-- Flames and effects could be added here similar to original -->
    </T.Group>
{/if}
