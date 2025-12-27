<script lang="ts">
    import { Canvas } from "@threlte/core";
    import { World } from "@threlte/rapier";
    import { onMount } from "svelte";
    import { insertCoin, onPlayerJoin } from "playroomkit";
    import { KeyboardControls } from "@threlte/extras";
    import { gameStore } from "./lib/state/gameStore.svelte";
    import Experience from "./components/Experience.svelte";
    import * as THREE from "three";

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
            gameStore.id = state.id;

            state.onQuit(() => {
                gameStore.removePlayer(state);
            });
        });
    });
</script>

<Canvas dpr={1} toneMapping={THREE.AgXToneMapping}>
    <World gravity={[0, -90, 0]}>
        <KeyboardControls {map}>
            <Experience networkBananas={[]} networkShells={[]} />
        </KeyboardControls>
    </World>
</Canvas>

<style>
    :global(canvas) {
        touch-action: none;
    }
</style>
