<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { Billboard, Text } from "@threlte/extras";
    import { Collider, RigidBody } from "@threlte/rapier";
    import * as THREE from "three";
    import { gameStore } from "../lib/state/gameStore.svelte";
    import { basePath } from "../lib/utils/path";
    import Mario from "./models/characters/Mario_kart.svelte";

    let { player, userPlayer } = $props<{ player: any; userPlayer: boolean }>();

    let kart = $state<THREE.Group>();
    let mario = $state<THREE.Group>();
    let body = $state<any>();

    let isBoosting = $state(false);
    let shouldLaunch = $state(false);
    let turboColor = $state(0xffffff);
    let scale = $state(0);

    useTask(() => {
        if (player.id === gameStore.id) return;

        const bodyPosition = player.getState("position");
        const bodyRotation = player.getState("rotation");
        isBoosting = player.getState("isBoosting");
        shouldLaunch = player.getState("shouldLaunch");
        turboColor = player.getState("turboColor");
        scale = player.getState("scale");

        if (bodyPosition && bodyRotation && kart && body) {
            kart.position.set(
                bodyPosition.x,
                bodyPosition.y - 0.5,
                bodyPosition.z,
            );
            kart.rotation.set(0, bodyRotation, 0);
            body.setTranslation({
                x: bodyPosition.x,
                y: bodyPosition.y,
                z: bodyPosition.z,
            });
        }
    });
</script>

{#if player.id !== gameStore.id}
    <RigidBody bind:ref={body} type="kinematicPosition" colliders={false}>
        <Collider shape="ball" args={[0.5]} />
    </RigidBody>

    <T.Group bind:ref={kart}>
        <T.Group bind:ref={mario}>
            <Billboard position={[0, 2.5, 0]}>
                <Text
                    text={player.state.profile.name}
                    font={basePath("/fonts/HK.ttf")}
                    fontSize={0.4}
                    anchorX="center"
                    anchorY="middle"
                />
            </Billboard>

            <Mario
                currentSpeed={0}
                steeringAngleWheels={0}
                {isBoosting}
                {shouldLaunch}
            />

            <!-- Effects (simplified for dummies) -->
        </T.Group>
    </T.Group>
{/if}
