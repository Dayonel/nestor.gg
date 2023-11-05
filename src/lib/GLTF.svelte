<script lang="ts">
    import * as THREE from "three";
    import type { MaterialDTO } from "../core/dto/MaterialDTO";
    import { onMount } from "svelte";

    export let scene: THREE.Scene;
    export let position: THREE.Vector3;
    export let material: MaterialDTO | undefined = undefined;
    export let gltf: any;

    onMount(() => {
        const model = gltf.clone();
        model.position.copy(position);
        model.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;

                if (material && obj.name == material.key) {
                    obj.material = material.value;
                } else {
                    obj.material = new THREE.MeshLambertMaterial();
                }
            }
        });
        scene.add(model);
        console.log("model " + model.uuid + " added");
    });
</script>
