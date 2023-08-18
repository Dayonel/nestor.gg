<script lang="ts">
    import { onMount } from "svelte";
    // @ts-ignore
    import * as THREE from "three";

    export let scene: THREE.Scene;
    export let rotationEnabled: boolean;

    let cursor: { x: number; y: number } = { x: 0.5, y: 0.5 };

    onMount(() => {
        window.addEventListener("pointermove", onPointerMove);

        loop();
    });

    const onPointerMove = (event: PointerEvent) => {
        cursor.x = event.pageX / window.innerWidth;
        cursor.y = event.pageY / window.innerHeight;
    };

    const loop = () => {
        requestAnimationFrame(loop);
        if (!rotationEnabled) return;
        if (!scene) return;

        scene.traverse((node: any) => {
            if (node instanceof THREE.Mesh) {
                node.rotation.x = (cursor.y - 0.5);
                node.rotation.y = (cursor.x - 0.5);
            }
        });
    };
</script>
