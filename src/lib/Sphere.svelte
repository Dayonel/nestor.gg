<script lang="ts">
    import * as THREE from "three";
    import { createEventDispatcher, onMount } from "svelte";

    export let scene: THREE.Scene;
    export let position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    export let scale: number = 1;
    export let ref: any = undefined;
    export let envMap: any = undefined;

    const dispatch = createEventDispatcher();

    onMount(() => {
        const geometry = new THREE.IcosahedronGeometry(1, 15);

        const material = new THREE.MeshPhysicalMaterial({
            transmission: 1,
            roughness: 0,
            reflectivity: 1,
            ior: 1.2,
            thickness: 10,
            metalness: 0.1,
        });
        if (envMap) {
            material.envMap = envMap;
            material.envMapIntensity = 1.5;
        }
        ref = new THREE.Mesh(geometry, material);
        ref.position.copy(position);
        ref.scale.setScalar(scale);
        ref.receiveShadow = true;
        scene.add(ref);

        ref.userData.velocity = new THREE.Vector3(
            randomDirection(),
            randomDirection(),
            0
        );

        dispatch("mount", { ref });
    });

    const randomDirection = (min: number = 0.002, max: number = 0.005) => {
        return min + Math.random() * (max - min);
    };
</script>
