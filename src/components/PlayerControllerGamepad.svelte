<script lang="ts">
    import PlayerControllerKeyboard from "./PlayerControllerKeyboard.svelte";
    let { ...props } = $props();
</script>

<PlayerControllerKeyboard {...props} />
