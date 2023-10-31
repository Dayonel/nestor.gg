<script lang="ts">
    import type { Vector3 } from "three";
    import type { MaterialDTO } from "../core/dto/MaterialDTO";
    import { onMount } from "svelte";

    export let scene: THREE.Scene;
    export let position: Vector3;
    export let material: MaterialDTO | undefined = undefined;
    export let gltf: any;

    onMount(() => {
        const model = gltf.clone();
        model.position.copy(position);
        model.scale.multiplyScalar(1.5);
        model.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;

                if (material && obj.name == material.key) {
                    obj.material = material.value;
                }
            }
        });
        scene.add(model);
    });
</script>
