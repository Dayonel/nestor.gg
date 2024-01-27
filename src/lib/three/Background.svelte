<script lang="ts">
    import * as THREE from "three";
    import { onMount } from "svelte";

    export let scene: THREE.Scene;
    export let width: number = 200;
    export let height: number = 200;
    export let color: THREE.ColorRepresentation;
    export let position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    export let rotation: THREE.Euler = new THREE.Euler(0, 0, 0);
    export let scale: number = 1;
    export let receiveShadow: boolean = true;
    export let ref: any = undefined;
    export let material: any = new THREE.MeshStandardMaterial({ color: color });

    onMount(() => {
        // plane
        const geometry = new THREE.PlaneGeometry(width, height);

        ref = new THREE.Mesh(geometry, material);
        ref.position.copy(position);
        ref.rotation.copy(rotation);
        ref.scale.multiplyScalar(scale);
        if (receiveShadow) {
            ref.receiveShadow = true;
        }
        scene.add(ref);
    });
</script>
