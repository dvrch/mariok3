<script lang="ts">
    import { Canvas } from "@threlte/core";
    import { World, Debug } from "@threlte/rapier";
    import { onMount } from "svelte";
    import { AudioListener } from "@threlte/extras";
    import { insertCoin, onPlayerJoin, myPlayer } from "playroomkit";
    import KeyboardControls from "./components/KeyboardControls.svelte";
    import { gameStore } from "./lib/state/gameStore.svelte";
    import Experience from "./components/Experience.svelte";
    import * as THREE from "three";

    import SceneSetup from "./components/SceneSetup.svelte";
    import FallUI from "./components/UI/FallUI.svelte";

    const map = [
        { name: "up", keys: ["KeyW", "ArrowUp"] },
        { name: "down", keys: ["KeyS", "ArrowDown"] },
        { name: "left", keys: ["KeyA", "ArrowLeft"] },
        { name: "right", keys: ["KeyD", "ArrowRight"] },
        { name: "jump", keys: ["Space"] },
        { name: "slow", keys: ["Shift"] },
        { name: "shoot", keys: ["KeyE"] },
        { name: "reset", keys: ["KeyR"] },
        { name: "escape", keys: ["Escape"] },
    ];

    onMount(async () => {
        await insertCoin({ skipLobby: true });

        onPlayerJoin((state) => {
            gameStore.addPlayer(state);

            state.onQuit(() => {
                gameStore.removePlayer(state);
            });
        });

        // Use myPlayer() to get the local player ID reliably
        gameStore.id = myPlayer().id;
    });
</script>

<Canvas dpr={1} toneMapping={THREE.AgXToneMapping}>
    <SceneSetup />
    <World gravity={[0, -30, 0]}>
        <AudioListener />
        <KeyboardControls {map}>
            <Experience networkBananas={[]} networkShells={[]} />
        </KeyboardControls>
    </World>
</Canvas>

<FallUI />

<style>
    :global(canvas) {
        touch-action: none;
    }
</style>
