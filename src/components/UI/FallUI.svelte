<script lang="ts">
    import { gameStore } from "../../lib/state/gameStore.svelte";
    import { fade, fly } from "svelte/transition";
    import { backOut } from "svelte/easing";

    function handleRestart() {
        console.log("🏎️ Manual Reset Requested from UI");
        gameStore.triggerReset();
    }
</script>

{#if gameStore.isFallen}
    <div class="overlay" transition:fade={{ duration: 300 }}>
        <div
            class="content"
            transition:fly={{ y: 200, duration: 600, easing: backOut }}
        >
            <h1 class="title">TOMBÉ !</h1>
            <p class="subtitle">Attention à la route, pilote !</p>

            <button class="restart-button" onclick={handleRestart}>
                <span class="icon">🏎️</span>
                REVENIR SUR LA PISTE
            </button>
        </div>
    </div>
{/if}

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(
            circle,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0.8) 100%
        );
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(8px);
        font-family: "Inter", sans-serif;
    }

    .content {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 3rem;
        border-radius: 2rem;
        text-align: center;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        max-width: 400px;
        width: 90%;
    }

    .title {
        color: #ff3e3e;
        font-size: 4rem;
        font-weight: 900;
        margin: 0;
        text-shadow: 0 0 20px rgba(255, 62, 62, 0.5);
        letter-spacing: -2px;
    }

    .subtitle {
        color: white;
        font-size: 1.2rem;
        margin: 1rem 0 2rem;
        opacity: 0.8;
    }

    .restart-button {
        background: linear-gradient(135deg, #ff4d4d 0%, #ff0000 100%);
        color: white;
        border: none;
        padding: 1.2rem 2.4rem;
        font-size: 1.2rem;
        font-weight: 800;
        border-radius: 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        width: 100%;
        box-shadow: 0 10px 20px rgba(255, 0, 0, 0.3);
    }

    .restart-button:hover {
        transform: scale(1.05) translateY(-5px);
        box-shadow: 0 15px 30px rgba(255, 0, 0, 0.5);
    }

    .restart-button:active {
        transform: scale(0.95);
    }

    .icon {
        font-size: 1.5rem;
    }
</style>
