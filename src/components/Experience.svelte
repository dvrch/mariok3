<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { Environment } from "@threlte/extras";
    import { gameStore } from "../lib/state/gameStore.svelte";
    import { myPlayer } from "playroomkit";
    import ParisBis from "./models/tracks/Paris-bis.svelte";
    import Ground from "./Ground.svelte";
    import ItemBox from "./models/misc/Gift.svelte";
    import Coin from "./models/misc/Super_mario_bros_coin.svelte";
    import Banana from "./models/items/Banana_peel_mario_kart.svelte";
    import Shell from "./models/items/Mario_shell_red.svelte";
    import PlayerDummies from "./PlayerDummies.svelte";
    import Skid from "./Skid.svelte";
    import PlayerControllerKeyboard from "./PlayerControllerKeyboard.svelte";
    import PlayerControllerGamepad from "./PlayerControllerGamepad.svelte";
    import PlayerControllerTouch from "./PlayerControllerTouch.svelte";
    import PlayerController from "./PlayerController.svelte";
    import { onMount } from "svelte";
    import { basePath } from "../lib/utils/path";
    import * as THREE from "three";

    // Props for multiplayer states (simplified for now)
    let { networkBananas = [], networkShells = [] } = $props<{
        networkBananas: any[];
        networkShells: any[];
    }>();

    let cam = $state<THREE.PerspectiveCamera>();
    let lookAtTarget = $state<THREE.Mesh>();
    let currentPoint = $state(0);
    let pointest = $state<any[]>([]);

    // Simulation of path animation when game not started
    useTask((delta) => {
        const _cam = cam;
        const _target = lookAtTarget;
        const _points = pointest;

        if (
            gameStore.introAnimationPlaying &&
            !gameStore.gameStarted &&
            _cam &&
            _target &&
            _points.length > 0
        ) {
            const speedFactor = 5;
            const targetPoint = new THREE.Vector3(
                pointest[currentPoint].x,
                pointest[currentPoint].y,
                pointest[currentPoint].z,
            );

            if (cam) cam.position.lerp(targetPoint, delta * speedFactor);

            const nextPointIdx = (currentPoint + 1) % pointest.length;
            const lookAtPoint = new THREE.Vector3(
                pointest[nextPointIdx].x,
                pointest[nextPointIdx].y,
                pointest[nextPointIdx].z,
            );

            _target.position.lerp(lookAtPoint, delta * speedFactor);
            if (cam && _target) {
                cam.lookAt(_target.position);
            }

            if (_cam.position.distanceTo(targetPoint) < 5) {
                currentPoint = nextPointIdx;
            }
        } else if (gameStore.introAnimationPlaying) {
            console.log("Animation skipped:", {
                introPlaying: gameStore.introAnimationPlaying,
                started: gameStore.gameStarted,
                hasCam: !!cam,
                hasTarget: !!lookAtTarget,
                points: pointest.length,
            });
        }
    });

    onMount(async () => {
        // Load points (Mock or fetch CurvedPath.json)
        try {
            const resp = await fetch(basePath("/CurvedPath.json")); // en BD
            const data = await resp.json();
            const points = Array.isArray(data) ? data : data.points;

            if (Array.isArray(points)) {
                console.log("Loaded points:", points.length);
                const mappedPoints = points
                    .map((p: any) => ({
                        x: p.x * 50,
                        y: p.y * 50,
                        z: p.z * 50,
                    }))
                    .reverse();
                // CRITICAL: Reassign to trigger Svelte reactivity, don't use push()
                pointest = mappedPoints;
                currentPoint = 0; // Start from the beginning
                console.log("✅ Points assigned, animation should start");
            } else {
                console.warn(
                    "CurvedPath.json did not return a valid points array",
                    data,
                );
            }
        } catch (e) {
            console.error("Failed to load path", e);
        }
    });
</script>

{#if gameStore.gameStarted}
    {#each gameStore.players as player (player.id)}
        {#if gameStore.controls === "keyboard"}
            <PlayerControllerKeyboard
                {player}
                userPlayer={player.id === myPlayer()?.id}
            />
        {:else if gameStore.controls === "gamepad"}
            <PlayerControllerGamepad
                {player}
                userPlayer={player.id === myPlayer()?.id}
            />
        {:else if gameStore.controls === "touch"}
            <PlayerControllerTouch
                {player}
                userPlayer={player.id === myPlayer()?.id}
            />
        {:else}
            <PlayerController
                {player}
                userPlayer={player.id === myPlayer()?.id}
            />
        {/if}

        <PlayerDummies {player} userPlayer={player.id === myPlayer()?.id} />
    {/each}
{/if}

{#if !gameStore.gameStarted}
    <T.Mesh bind:ref={lookAtTarget} />
    <T.PerspectiveCamera
        bind:ref={cam}
        makeDefault
        position={[0, 2, 0]}
        far={5000}
    />
{/if}

<ParisBis position={[0, 0, 0]} />
<ItemBox position={[-20, 2.5, -119]} />
<Coin position={[-30, 2, -119]} />

<Skid />
<Ground position={[0, 0, 0]} />
<Environment resolution={256} preset="lobby" />

{#each networkBananas as banana (banana.id)}
    <Banana position={banana.position} id={banana.id} />
{/each}

{#each networkShells as shell (shell.id)}
    <Shell id={shell.id} position={shell.position} rotation={shell.rotation} />
{/each}

<T.AmbientLight intensity={3} />
<T.HemisphereLight intensity={1.5} groundColor={0xffffff} skyColor={0x87ceeb} />
<T.DirectionalLight
    position={[10, 50, -30]}
    intensity={1}
    castShadow
    shadow.bias={-0.0001}
    shadow.mapSize={[4096, 4096]}
    shadow.camera.left={-300}
    shadow.camera.right={300}
    shadow.camera.top={300}
    shadow.camera.bottom={-300}
/>
