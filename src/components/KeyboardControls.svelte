<script lang="ts">
    import { createKeyboardControls } from "./useKeyboardControls";

    let { map, children } = $props<{
        map: { name: string; keys: string[] }[];
        children?: any;
    }>();

    createKeyboardControls(map);
</script>

{@render children?.()}
