<script lang="ts">
    // @ts-nocheck
    import { onMount } from "svelte";
    import * as THREE from "three";

    export let camera: THREE.PerspectiveCamera;
    const mouseTolerance = 0.000015;

    onMount(() => {
        window.onmousemove = (e: MouseEvent) => onMouseMove(e);
    });

    const onMouseMove = (e: MouseEvent) => {
        var centerX = window.innerWidth * 0.5;
        var centerY = camera.position.y + window.innerHeight * 0.5;

        camera.position.x = (e.clientX - centerX) * mouseTolerance;
        camera.position.y = (e.clientY - centerY) * mouseTolerance;
    };
</script>
