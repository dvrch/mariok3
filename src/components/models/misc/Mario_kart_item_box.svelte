<script lang="ts">
    import ItemBox_model from "./ItemBox_model.svelte";

    let { position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] } = $props<{
        position?: [number, number, number];
        scale?: [number, number, number] | number;
        rotation?: [number, number, number];
    }>(); 
</script>

<ItemBox_model {position} {scale} {rotation} />
