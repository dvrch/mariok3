<script lang="ts">
    import { useThrelte } from "@threlte/core";
    import { onMount } from "svelte";

    const { renderer } = useThrelte();

    onMount(() => {
        renderer.setClearColor(0xffffff, 1);
    });
</script>
