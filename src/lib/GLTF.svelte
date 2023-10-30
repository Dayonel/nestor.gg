<script lang="ts">
    import { onMount } from "svelte";
    import type { Vector3 } from "three";
    import type { MaterialDTO } from "../core/dto/MaterialDTO";

    export let scene: THREE.Scene;
    export let position: Vector3;
    export let material: MaterialDTO | undefined = undefined;
    export let gltf: any;

    gltf.position.copy(position);
    gltf.scale.multiplyScalar(1.5);
    gltf.traverse((obj: any) => {
        if (obj.isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;

            if (material && obj.name == material.key) {
                obj.material = material.value;
            }
        }
    });
    scene.add(gltf);
</script>
