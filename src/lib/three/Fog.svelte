<script lang="ts">
    import * as THREE from "three";
    import { onMount } from "svelte";

    export let scene: THREE.Scene;
    export let color: THREE.ColorRepresentation;
    export let near: number;
    export let far: number;

    onMount(() => {
        // TIP: scene background color = fog color
        scene.background = new THREE.Color(color);
        scene.fog = new THREE.Fog(color, near, far);
    });
</script>
