<script lang="ts">
    import * as THREE from "three";
    import { onMount } from "svelte";

    export let scene: THREE.Scene;
    export let color: THREE.ColorRepresentation;
    export let intensity: number;
    export let distance: number = 0;
    export let decay: number = 2;
    export let position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    export let ref: any | undefined = undefined;

    onMount(() => {
        ref = new THREE.PointLight(color, intensity, distance, decay);
        ref.position.copy(position);
        scene.add(ref);
    });
</script>
