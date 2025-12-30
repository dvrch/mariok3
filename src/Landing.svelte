<script lang="ts">
    import { onMount } from "svelte";
    import { gameStore } from "./lib/state/gameStore.svelte";
    import { basePath } from "./lib/utils/path";
    import gsap from "gsap";

    let logo = $state<HTMLImageElement | null>(null);
    let startButton = $state<HTMLDivElement | null>(null);
    let setupStatus = $state(0);
    let controlStyle = $state("");

    onMount(() => {
        gameStore.gameStarted = false;
        if (setupStatus === 0) {
            const tl = gsap.timeline();
            if (logo && startButton) {
                tl.from(logo, {
                    scale: 122,
                    opacity: 0,
                    duration: 0,
                    ease: "power4.out",
                })
                    .to(logo, {
                        scale: 1,
                        opacity: 1,
                        duration: 1.5,
                        ease: "power4.out",
                    })
                    .to(startButton, {
                        opacity: 1,
                        duration: 3,
                        delay: 1,
                        ease: "power4.out",
                    });
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                setupStatus = 1;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    });

    const confirm = () => {
        if (controlStyle !== "") {
            console.log(
                "🎮 Confirm clicked, starting game with control:",
                controlStyle,
            );
            gameStore.controls = controlStyle;
            gameStore.introAnimationPlaying = false; // Stop intro
            gameStore.gameStarted = true; // Start game

            // Attendre que le composant PlayerController soit monté avant de trigger le reset
            setTimeout(() => {
                console.log(
                    "🔄 Calling triggerReset() after delay, resetSignal before:",
                    gameStore.resetSignal,
                );
                gameStore.triggerReset();
                console.log(
                    "🔄 triggerReset() called, resetSignal after:",
                    gameStore.resetSignal,
                );
            }, 100); // 100ms devrait suffire pour que Svelte monte le composant
        }
    };
</script>

{#if !gameStore.gameStarted}
    {#if setupStatus === 0}
        <div class="home">
            <div class="logo">
                <img bind:this={logo} src={basePath("/logo.png")} alt="logo" />
            </div>
            <div class="start" bind:this={startButton} style="opacity: 0;">
                <button
                    class="start-button"
                    onclick={() => (setupStatus = 1)}
                    autoFocus
                >
                    PRESS ENTER TO START
                </button>
            </div>
        </div>
    {:else if setupStatus === 1}
        <div class="home">
            <div class="glassy">
                <h1>CHOOSE YOUR CONTROL STYLE</h1>

                <div class="articles">
                    <button
                        type="button"
                        class="article {controlStyle === 'keyboard'
                            ? 'selected'
                            : ''}"
                        onclick={() => (controlStyle = "keyboard")}
                    >
                        <img
                            src={basePath("/images/keyboard.png")}
                            alt="keyboard"
                        />
                        <div class="article_label">
                            <p>Keyboard</p>
                        </div>
                    </button>

                    <button
                        type="button"
                        class="article {controlStyle === 'gamepad'
                            ? 'selected'
                            : ''}"
                        onclick={() => (controlStyle = "gamepad")}
                    >
                        <img
                            src={basePath("/images/gamepad.png")}
                            alt="gamepad"
                        />
                        <div class="article_label">
                            <p>Gamepad</p>
                        </div>
                    </button>

                    <button
                        type="button"
                        class="article {controlStyle === 'mouseKeyboard'
                            ? 'selected'
                            : ''}"
                        onclick={() => (controlStyle = "mouseKeyboard")}
                    >
                        <img
                            src={basePath("/images/mousekeyboard.png")}
                            alt="mouse & keyboard"
                        />
                        <div class="article_label">
                            <p>Mouse & Keyboard</p>
                        </div>
                    </button>

                    <button
                        type="button"
                        class="article {controlStyle === 'touch'
                            ? 'selected'
                            : ''}"
                        onclick={() => (controlStyle = "touch")}
                    >
                        <img
                            src={basePath("/images/mobile.png")}
                            alt="mobile"
                        />
                        <div class="article_label">
                            <p>Mobile</p>
                        </div>
                    </button>
                </div>

                <div class="submit {controlStyle !== '' ? '' : 'disabled'}">
                    <button
                        class="submit-button {controlStyle !== ''
                            ? ''
                            : 'disabled'}"
                        onclick={confirm}
                        disabled={controlStyle === ""}
                    >
                        CONFIRM
                    </button>
                </div>
            </div>
        </div>
    {/if}
{/if}

<style>
    /* On garde le style existant dans index.css, mais on peut ajouter des ajustements ici */
    .article {
        background: none;
        border: none;
        cursor: pointer;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: all 0.3s ease;
    }
</style>
