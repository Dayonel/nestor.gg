<script lang="ts">
    import * as THREE from "three";
    import { createEventDispatcher, onMount } from "svelte";
    import * as CANNON from "cannon-es";

    export let scene: THREE.Scene;
    export let position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    export let scale: number = 1;
    export let ref: any = undefined;
    export let radius = 1;
    export let envMap: any = undefined;

    const dispatch = createEventDispatcher();

    onMount(() => {
        const geometry = new THREE.IcosahedronGeometry(radius, 15);

        // const material = new THREE.MeshPhysicalMaterial({
        //     transmission: 1,
        //     roughness: 0,
        //     reflectivity: 1,
        //     ior: 1.2,
        //     thickness: 10,
        // });
        // if (envMap) {
        //     material.envMap = envMap;
        //     material.envMapIntensity = 1.5;
        // }

        const material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color("#3897a9"),
            emissive: new THREE.Color("#3897a9"),
            roughness: 0.5,
            // metalness: 0.1,
            reflectivity: 0.5,
        });
        ref = new THREE.Mesh(geometry, material);
        ref.position.copy(position);
        ref.scale.setScalar(scale);
        ref.receiveShadow = true;
        scene.add(ref);

        ref.userData.radius = radius;

        // physics
        const shape = new CANNON.Sphere(radius);
        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(
                ref.position.x,
                ref.position.y,
                ref.position.z
            ),
            shape: shape,
        });
        body.linearFactor = new CANNON.Vec3(1, 1, 0); // lock x and y axis
        body.angularFactor = new CANNON.Vec3(1, 1, 0); // lock x and y axis
        ref.userData.body = body;

        ref.userData.velocity = new THREE.Vector3(random(), random(), 0);

        dispatch("mount", { ref });
    });

    const random = (min: number = -0.002, max: number = 0.002) => {
        return min + Math.random() * (max - min);
    };
</script>
