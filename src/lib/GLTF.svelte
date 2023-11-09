<script lang="ts">
    import * as THREE from "three";
    import type { MaterialDTO } from "../core/dto/MaterialDTO";
    import { onMount } from "svelte";

    export let scene: THREE.Scene;
    export let position: THREE.Vector3;
    export let rotation: THREE.Euler = new THREE.Euler(0, 0, 0);
    export let material: MaterialDTO | undefined = undefined;
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

                if (material && obj.name == material.key) {
                    obj.material = material.value;
                } else {
                    obj.material = new THREE.MeshStandardMaterial({
                        color: 0xffffff,
                        metalness: 1,
                        roughness: 0.6,
                        side: THREE.DoubleSide,
                    });
                }
            }
        });
        if (group) {
            group.add(model);
        } else {
            scene.add(model);
        }
    });
</script>
