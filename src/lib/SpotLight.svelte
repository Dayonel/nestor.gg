<script lang="ts">
    import * as THREE from "three";
    import { onMount } from "svelte";

    export let scene: THREE.Scene;
    export let color: THREE.ColorRepresentation;
    export let intensity: number;
    export let distance: number = 0;
    export let decay: number = 2;
    export let penumbra: number = 1;
    export let angle: number = Math.PI / 6;
    export let position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    export let castShadow: boolean = true;
    export let ref: any | undefined = undefined;

    onMount(() => {
        ref = new THREE.SpotLight(
            color,
            intensity,
            distance,
            angle,
            penumbra,
            decay
        );
        ref.position.copy(position);

        if (castShadow) {
            ref.castShadow = true;
        }
        scene.add(ref);
    });
</script>
