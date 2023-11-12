<script lang="ts">
    import * as THREE from "three";
    import { onMount } from "svelte";

    export let scene: THREE.Scene;
    export let color: THREE.ColorRepresentation;
    export let position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    export let scale: number = 1;
    export let ref: any | undefined = undefined;

    onMount(() => {
        const geometry = new THREE.IcosahedronGeometry(1, 15);
        // const material = new THREE.MeshStandardMaterial({
        //     color: color,
        //     metalness: 1,
        //     roughness: 0.6,
        //     side: THREE.DoubleSide,
        // });
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0,
            roughness: 0,
            side: THREE.DoubleSide,
        });
        ref = new THREE.Mesh(geometry, material);
        ref.position.copy(position);
        ref.scale.setScalar(scale);
        scene.add(ref);
    });
</script>
