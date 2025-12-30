<script lang="ts">
    import { T } from "@threlte/core";
    import { Collider } from "@threlte/rapier";
    import GiftModel from "./Gift_model.svelte";
    import { gameStore } from "../../../lib/state/gameStore.svelte";
    import { audioManager } from "../../../lib/state/audioConfig";
    import { onMount } from "svelte";

    let { position } = $props<{ position: [number, number, number] }>();
    let isCollected = $state(false);

    const handleCollisionStart = (event: any) => {
        const other = event.detail.other;
        console.log("🎁 Gift collision with:", other.rigidBody?.name);
        
        if (other.rigidBody?.name === "player" && !isCollected) {
            console.log("✅ Gift collected! Triggering item and effects");
            isCollected = true;
            gameStore.setItem(); // This triggers ItemParticles
            audioManager.play("turbo");
        }
    };

    onMount(() => {
        console.log("✅ Gift mounted at", position);
    });
</script>

{#if !isCollected}
    <T.Group {position}>
        <GiftModel scale={[0.5, 0.5, 0.5]} position={[0, 0, 0]} />
        <Collider 
            shape="ball" 
            args={[1.5]} 
            on:collisionstart={handleCollisionStart}
        />
    </T.Group>
{/if}
