<script lang="ts">
    import * as THREE from "three";
    import { onMount } from "svelte";

    export let scene: THREE.Scene;
    export let color: THREE.ColorRepresentation;
    export let intensity: number;
    export let position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    export let scale: number = 1;
    export let ref: any | undefined = undefined;

    onMount(() => {
        ref = new THREE.DirectionalLight(color, intensity);
        ref.position.copy(position);
        ref.position.multiplyScalar(scale);

        ref.castShadow = true;

        ref.shadow.mapSize.width = 2048;
        ref.shadow.mapSize.height = 2048;

        const d = 50;

        ref.shadow.camera.left = -d;
        ref.shadow.camera.right = d;
        ref.shadow.camera.top = d;
        ref.shadow.camera.bottom = -d;

        ref.shadow.camera.far = 3500;
        ref.shadow.bias = -0.0001;

        scene.add(ref);
    });
</script>
