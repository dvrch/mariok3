<script lang="ts">
    import { onMount } from "svelte";

    let { size = 100, onMove, onStop } = $props<{
        size?: number;
        onMove?: (x: number, y: number) => void;
        onStop?: () => void;
    }>();

    let baseRef = $state<HTMLDivElement>();
    let stickRef = $state<HTMLDivElement>();
    let isDragging = $state(false);
    let stickPosition = $state({ x: 0, y: 0 });

    const maxDistance = size * 0.35; // Distance maximale du stick depuis le centre

    function getPositionFromEvent(event: TouchEvent | MouseEvent): { x: number; y: number } {
        if (event instanceof TouchEvent) {
            const touch = event.touches[0] || event.changedTouches[0];
            return { x: touch.clientX, y: touch.clientY };
        } else {
            return { x: event.clientX, y: event.clientY };
        }
    }

    function updateStickPosition(clientX: number, clientY: number) {
        if (!baseRef) return;

        const rect = baseRef.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let deltaX = clientX - centerX;
        let deltaY = clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Limiter à la distance maximale
        if (distance > maxDistance) {
            deltaX = (deltaX / distance) * maxDistance;
            deltaY = (deltaY / distance) * maxDistance;
        }

        stickPosition = { x: deltaX, y: deltaY };

        // Normaliser entre -1 et 1
        const normalizedX = deltaX / maxDistance;
        const normalizedY = -deltaY / maxDistance; // Inverser Y pour correspondre aux conventions

        if (onMove) {
            onMove(normalizedX, normalizedY);
        }
    }

    function handleStart(event: TouchEvent | MouseEvent) {
        event.preventDefault();
        isDragging = true;
        updateStickPosition(...Object.values(getPositionFromEvent(event)));
    }

    function handleMove(event: TouchEvent | MouseEvent) {
        if (!isDragging) return;
        event.preventDefault();
        updateStickPosition(...Object.values(getPositionFromEvent(event)));
    }

    function handleEnd(event: TouchEvent | MouseEvent) {
        if (!isDragging) return;
        event.preventDefault();
        isDragging = false;
        stickPosition = { x: 0, y: 0 };
        if (onStop) {
            onStop();
        }
    }

    onMount(() => {
        if (!baseRef) return;

        // Touch events
        baseRef.addEventListener("touchstart", handleStart as EventListener);
        window.addEventListener("touchmove", handleMove as EventListener);
        window.addEventListener("touchend", handleEnd as EventListener);

        // Mouse events
        baseRef.addEventListener("mousedown", handleStart as EventListener);
        window.addEventListener("mousemove", handleMove as EventListener);
        window.addEventListener("mouseup", handleEnd as EventListener);

        return () => {
            if (!baseRef) return;
            baseRef.removeEventListener("touchstart", handleStart as EventListener);
            window.removeEventListener("touchmove", handleMove as EventListener);
            window.removeEventListener("touchend", handleEnd as EventListener);
            baseRef.removeEventListener("mousedown", handleStart as EventListener);
            window.removeEventListener("mousemove", handleMove as EventListener);
            window.removeEventListener("mouseup", handleEnd as EventListener);
        };
    });
</script>

<div
    class="joystick-base"
    bind:this={baseRef}
    style="width: {size}px; height: {size}px;"
>
    <div
        class="joystick-stick"
        bind:this={stickRef}
        style="transform: translate({stickPosition.x}px, {stickPosition.y}px);"
    ></div>
</div>

<style>
    .joystick-base {
        position: relative;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        touch-action: none;
        user-select: none;
    }

    .joystick-stick {
        position: absolute;
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        transition: transform 0.1s ease-out;
    }
</style>
