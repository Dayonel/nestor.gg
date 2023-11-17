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

    onMount(() => {
        // plane
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshStandardMaterial({ color: color });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.scale.multiplyScalar(scale);
        if (receiveShadow) {
            mesh.receiveShadow = true;
        }
        scene.add(mesh);
    });
</script>
