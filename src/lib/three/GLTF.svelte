<script lang="ts">
    import * as THREE from "three";
    import type { MaterialDTO } from "../../core/dto/MaterialDTO";
    import { onMount } from "svelte";

    export let scene: THREE.Scene;
    export let position: THREE.Vector3;
    export let rotation: THREE.Euler = new THREE.Euler(0, 0, 0);
    export let materials: MaterialDTO[] | undefined = undefined;
    export let group: THREE.Group | undefined = undefined;
    export let gltf: THREE.Object3D;
    export let scale: number = 1;

    onMount(() => {
        const model = gltf.clone();
        model.position.copy(position);
        model.rotation.copy(rotation);
        model.scale.multiplyScalar(scale);
        model.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;

                applyMaterials(obj);
            }
        });
        if (group) {
            group.add(model);
        } else {
            scene.add(model);
        }
    });

    const applyMaterials = (obj: any) => {
        if (!materials) return;

        materials
            .sort((a, b) => {
                if (b.key) return -1;
                if (a.key) return 1;

                return 0;
            })
            .forEach((f) => {
                if ((f.key && obj.name == f.key) || !f.key) {
                    obj.material = f.value;
                }
            });
    };
</script>
