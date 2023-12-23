<script lang="ts">
    import * as THREE from "three";
    import { createEventDispatcher, onMount } from "svelte";
    import * as CANNON from "cannon-es";

    export let scene: THREE.Scene;
    export let position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    export let scale: number = 1;
    export let material: any = new THREE.MeshStandardMaterial();
    export let color: THREE.ColorRepresentation | undefined = undefined;
    export let secondColor: THREE.ColorRepresentation | undefined = undefined;
    export let ref: any = undefined;
    export let radius = 1;
    export let envMap: any = undefined;

    const dispatch = createEventDispatcher();

    onMount(() => {
        const geometry = new THREE.IcosahedronGeometry(radius, 15);

        if (envMap) {
            material.envMap = envMap;
            material.envMapIntensity = 1.5;
        }

        const mat = material.clone();
        // if (color) {
        //     mat.uniforms.diffuse.value = new THREE.Color(color);
        // }
        // if (secondColor) {
        //     mat.uniforms.secondColor.value = new THREE.Color(secondColor);
        // }

        ref = new THREE.Mesh(geometry, mat);
        ref.position.copy(position);
        ref.scale.setScalar(scale);
        // ref.receiveShadow = true;
        scene.add(ref);

        ref.userData.radius = radius;

        // physics
        const shape = new CANNON.Sphere(radius);
        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(
                ref.position.x,
                ref.position.y,
                ref.position.z,
            ),
            shape: shape,
        });
        body.linearFactor = new CANNON.Vec3(1, 1, 0); // lock x and y axis
        body.angularFactor = new CANNON.Vec3(1, 1, 0); // lock x and y axis
        ref.userData.body = body;

        ref.userData.velocity = new THREE.Vector3(random(), random(), 0);

        dispatch("mount", { ref });
    });

    const random = (min: number = -0.001, max: number = 0.001) => {
        return min + Math.random() * (max - min);
    };
</script>
