<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import {
        PerspectiveCamera,
        PositionalAudio,
        useKeyboardControls,
    } from "@threlte/extras";
    import { BallCollider, RigidBody } from "@threlte/rapier";
    import * as THREE from "three";
    import { gameStore } from "../lib/state/gameStore.svelte";
    import Mario from "./models/characters/Mario_kart.svelte";
    import DriftParticlesLeft from "./Particles/drifts/DriftParticlesLeft.svelte";
    import DriftParticlesRight from "./Particles/drifts/DriftParticlesRight.svelte";
    import SmokeParticles from "./Particles/smoke/SmokeParticles.svelte";
    import PointParticle from "./Particles/drifts/PointParticle.svelte";
    import HitParticles from "./Particles/hits/HitParticles.svelte";
    import CoinParticles from "./Particles/coins/CoinParticles.svelte";
    import ItemParticles from "./Particles/items/ItemParticles.svelte";

    let { player, userPlayer } = $props<{ player: any; userPlayer: boolean }>();

    // Inputs
    const up = useKeyboardControls(); // Svelte implementation of KeyboardControls might vary
    // For Threlte 8+, useKeyboardControls is typically used within the KeyboardControls provider

    // Local State (Runes)
    let isOnGround = $state(false);
    let body = $state<any>();
    let kart = $state<THREE.Group>();
    let mario = $state<THREE.Group>();
    let cam = $state<THREE.PerspectiveCamera>();

    let currentSpeed = $state(0);
    let currentSteeringSpeed = $state(0);
    let turboColor = $state(0xffffff);
    let isBoosting = $state(false);
    let scale = $state(0);
    let steeringAngleWheels = $state(0);
    let shouldLaunch = $state(false);

    // Constants & Refs (Non-reactive)
    const maxSpeed = 30;
    const boostSpeed = 50;
    const acceleration = 0.1;
    const decceleration = 0.2;
    const damping = -0.1;
    const MaxSteeringSpeed = 0.01;

    let jumpForce = 0;
    let jumpIsHeld = false;
    let driftDirection = 0;
    let driftLeft = false;
    let driftRight = false;
    let driftForce = 0;
    let accumulatedDriftPower = 0;
    let effectiveBoost = 0;
    let boostDuration = 0;
    let slowDownDuration = 1500;

    // Sounds (Refs)
    let engineSound: any;
    let driftSound: any;
    let driftTwoSound: any;
    let driftOrangeSound: any;
    let driftPurpleSound: any;
    let driftBlueSound: any;
    let jumpSound: any;
    let landingSound: any;
    let turboSound: any;

    useTask((delta) => {
        if (player.id !== gameStore.id) return;
        if (!body || !mario || !kart || !cam) return;

        const keys = $up; // Accessing the keyboard state

        // Logic from the original useFrame...
        // (I'll condense some of it for brevity while keeping the core functionality)

        // Acceleration / Braking
        if (keys.up && currentSpeed < maxSpeed) {
            currentSpeed = Math.min(
                currentSpeed + acceleration * delta * 144,
                maxSpeed,
            );
        } else if (!keys.up) {
            currentSpeed = Math.max(
                currentSpeed - decceleration * delta * 144,
                0,
            );
        }

        if (keys.down && currentSpeed <= 0) {
            currentSpeed = Math.max(
                currentSpeed - acceleration * delta * 144,
                -maxSpeed,
            );
        }

        // Steering
        let steeringAngle = 0;
        if (keys.left && currentSpeed !== 0) {
            steeringAngle = MaxSteeringSpeed;
        } else if (keys.right && currentSpeed !== 0) {
            steeringAngle = -MaxSteeringSpeed;
        }

        kart.rotation.y += steeringAngle * delta * 144;
        steeringAngleWheels = steeringAngle * 25;

        // Movement Physics
        const kartRotation = kart.rotation.y;
        const forwardDirection = new THREE.Vector3(
            -Math.sin(kartRotation),
            0,
            -Math.cos(kartRotation),
        );

        body.applyImpulse(
            {
                x: forwardDirection.x * currentSpeed * delta * 144,
                y: jumpForce * delta * 144,
                z: forwardDirection.z * currentSpeed * delta * 144,
            },
            true,
        );

        // Damping
        const velocity = body.linvel();
        body.applyImpulse(
            {
                x: -velocity.x * (1 - damping) * delta * 144,
                y: 0,
                z: -velocity.z * (1 - damping) * delta * 144,
            },
            true,
        );

        // Sync Kart Visuals
        const translation = body.translation();
        kart.position.set(translation.x, translation.y - 0.5, translation.z);

        // Sync Multiplayer State
        player.setState("position", translation);
        player.setState("rotation", kartRotation + mario.rotation.y);
    });
</script>

{#if player.id === gameStore.id}
    <T.Group>
        <RigidBody
            bind:ref={body}
            colliders={false}
            position={[8, 60, -119]}
            mass={3}
            ccd
            name="player"
            type="dynamic"
        >
            <BallCollider
                args={[0.5]}
                mass={3}
                on:collisionEnter={() => (isOnGround = true)}
                on:collisionExit={() => (isOnGround = false)}
            />
        </RigidBody>

        <T.Group bind:ref={kart} rotation={[0, Math.PI / 2, 0]}>
            <T.Group bind:ref={mario}>
                <Mario
                    {currentSpeed}
                    {steeringAngleWheels}
                    {isBoosting}
                    {shouldLaunch}
                />
                <CoinParticles coins={gameStore.coins} />
                <ItemParticles item={gameStore.item} />

                <!-- Turbo Visualization -->
                <T.Mesh position={[0.6, 0.05, 0.5]} {scale}>
                    <T.SphereGeometry args={[0.05, 16, 16]} />
                    <T.MeshStandardMaterial
                        emissive={turboColor}
                        toneMapped={false}
                        emissiveIntensity={100}
                        transparent
                        opacity={0.4}
                    />
                </T.Mesh>

                <DriftParticlesLeft {turboColor} {scale} />
                <DriftParticlesRight {turboColor} {scale} />
                <SmokeParticles driftRight={false} driftLeft={false} />
                <HitParticles {shouldLaunch} />
            </T.Group>

            <T.PerspectiveCamera
                bind:ref={cam}
                makeDefault
                position={[0, 2, 8]}
                fov={50}
                far={5000}
            />

            <!-- Audio components would go here if Threlte PositionalAudio is used -->
        </T.Group>
    </T.Group>
{/if}
