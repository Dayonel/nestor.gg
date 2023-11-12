<script lang="ts">
    import * as THREE from "three";
    import { onMount } from "svelte";

    export let scene: THREE.Scene;
    export let color: THREE.ColorRepresentation;
    export let secondColor: THREE.ColorRepresentation;
    export let position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    export let material: THREE.ShaderMaterial;
    export let scale: number = 1;
    export let ref: any | undefined = undefined;

    onMount(() => {
        const geometry = new THREE.IcosahedronGeometry(1, 15);

        const mat = material.clone();
        mat.uniforms.diffuse.value = new THREE.Color(color);
        mat.uniforms.secondColor.value = new THREE.Color(secondColor);

        ref = new THREE.Mesh(geometry, mat);
        ref.position.copy(position);
        ref.scale.setScalar(scale);
        scene.add(ref);
    });
</script>
