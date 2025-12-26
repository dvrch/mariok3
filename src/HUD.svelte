<script lang="ts">
    import { onMount } from "svelte";
    import { gameStore } from "./lib/state/gameStore.svelte";

    let wheelElement = $state<HTMLDivElement | null>(null);

    const itemImage = $derived.by(() => {
        switch (gameStore.item) {
            case "banana":
                return "./images/banana.webp";
            case "mushroom":
                return "./images/mushroom.png";
            case "shell":
                return "./images/shell.webp";
            default:
                return "";
        }
    });

    onMount(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (wheelElement) {
                const { clientX, clientY } = e;
                const screenWidth = window.innerWidth;
                const rotation =
                    ((clientX - screenWidth / 2) / screenWidth) * 180;

                wheelElement.style.left = `${clientX - 100}px`;
                wheelElement.style.top = `${clientY - 100}px`;
                wheelElement.style.transform = `rotate(${rotation}deg)`;
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    });

    // Joystick handlers (Simplified)
    const handleJoystickMove = (x: number) => {
        gameStore.joystickX = x;
    };

    const handleJoystickStop = () => {
        gameStore.joystickX = 0;
    };
</script>

<div class="overlay">
    {#if gameStore.gameStarted}
        <div class="item">
            <div class="borderOut">
                <div class="borderIn">
                    <div class="background">
                        {#if itemImage}
                            <img src={itemImage} alt="item" width={90} />
                        {/if}
                    </div>
                </div>
            </div>
        </div>

        {#if gameStore.controls === "touch"}
            <!-- Joystick Placeholder / Simple Implementation -->
            <div class="controls joystick">
                <!-- Simplement un cercle pour le moment -->
                <div class="joystick-base">
                    <div class="joystick-stick"></div>
                </div>
            </div>

            <div
                class="controls drift"
                onmousedown={() => (gameStore.driftButton = true)}
                onmouseup={() => (gameStore.driftButton = false)}
                ontouchstart={(e) => {
                    e.preventDefault();
                    gameStore.driftButton = true;
                }}
                ontouchend={(e) => {
                    e.preventDefault();
                    gameStore.driftButton = false;
                }}
            >
                drift
            </div>

            <div
                class="controls itemButton"
                onmousedown={() => (gameStore.itemButton = true)}
                onmouseup={() => (gameStore.itemButton = false)}
                ontouchstart={(e) => {
                    e.preventDefault();
                    gameStore.itemButton = true;
                }}
                ontouchend={(e) => {
                    e.preventDefault();
                    gameStore.itemButton = false;
                }}
            >
                item
            </div>

            <div
                class="controls menuButton"
                onmousedown={() => (gameStore.menuButton = true)}
                onmouseup={() => (gameStore.menuButton = false)}
                ontouchstart={(e) => {
                    e.preventDefault();
                    gameStore.menuButton = true;
                }}
                ontouchend={(e) => {
                    e.preventDefault();
                    gameStore.menuButton = false;
                }}
            >
                menu
            </div>
        {/if}
    {/if}
</div>

<style>
    .joystick-base {
        width: 100px;
        height: 100px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .joystick-stick {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
    }
</style>
