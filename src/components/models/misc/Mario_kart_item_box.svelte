<script lang="ts">
    import { T } from "@threlte/core";

    interface Props {
        position?: [number, number, number];
        scale?: [number, number, number] | number;
        rotation?: [number, number, number];
    }

    let { position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] } = $props<Props>();
</script>

<T.Group {position} {scale} {rotation}>
    <T.Mesh castShadow receiveShadow>
        <T.BoxGeometry args={[1, 1, 1]} />
        <T.MeshStandardMaterial color={0xffff00} metalness={0.5} roughness={0.5} />
    </T.Mesh>
</T.Group>
