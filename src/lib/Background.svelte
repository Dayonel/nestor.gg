<script lang="ts">
    import * as THREE from "three";
    import { onMount } from "svelte";

    export let scene: THREE.Scene;
    export let width: number = 200;
    export let height: number = 200;
    export let color: THREE.ColorRepresentation;
    export let position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    export let scale: number = 1;
    export let receiveShadow: boolean = true;
    export let ref: any = undefined;

    onMount(() => {
        // plane
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshStandardMaterial({ color: color });

        ref = new THREE.Mesh(geometry, material);
        ref.position.copy(position);
        ref.scale.multiplyScalar(scale);
        if (receiveShadow) {
            ref.receiveShadow = true;
        }
        scene.add(ref);
    });
</script>
