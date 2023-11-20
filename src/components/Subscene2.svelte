<script lang="ts">
    import * as THREE from "three";
    import { Vector3 } from "three";
    import Sphere from "$lib/Sphere.svelte";
    import { onMount } from "svelte";
    import Background from "$lib/Background.svelte";
    import SpotLight from "$lib/SpotLight.svelte";
    import * as CANNON from "cannon-es";

    export let renderer: THREE.WebGLRenderer;
    export let camera: THREE.PerspectiveCamera;
    export let scene: THREE.Scene;
    export let element: HTMLElement;
    export let hdris: any[] = [];
    export let enabled: boolean;
    $: enabled, loop();

    let envMap: any;
    let spheres: THREE.Object3D[] = [];
    let background: any;
    const world = new CANNON.World();

    const spawnSpheres = [
        { position: new Vector3(-4, 6, 3), radius: 0.7 },
        { position: new Vector3(-1, 6, 5), radius: 0.8 },
        { position: new Vector3(4.5, 6, 3), radius: 0.7 },
        { position: new Vector3(-4, 3, 0), radius: 0.8 },
        { position: new Vector3(-3, 3.5, 2), radius: 0.77 },
        { position: new Vector3(1, 4, 2), radius: 0.75 },
        { position: new Vector3(2.25, 4, 0), radius: 0.75 },
        { position: new Vector3(5.25, 4, 0), radius: 0.85 },
        { position: new Vector3(-4, 0, 1.5), radius: 0.75 },
        { position: new Vector3(-0.75, 0.5, 0), radius: 0.88 },
        { position: new Vector3(0.6, -0.5, -2), radius: 0.9 },
        { position: new Vector3(1.85, 0, 0), radius: 0.7 },
        { position: new Vector3(3, -1, -1), radius: 0.9 },
        { position: new Vector3(-3, -1, 3), radius: 1 },
        { position: new Vector3(-3, -3, 2), radius: 0.6 },
        { position: new Vector3(-1, -3.5, 2), radius: 0.6 },
        { position: new Vector3(5, -3.5, 0), radius: 0.7 },
        { position: new Vector3(-2.5, -4.5, 4), radius: 0.8 },
        { position: new Vector3(0, -6, 4), radius: 0.8 },
        { position: new Vector3(3, -5, 4), radius: 0.65 },
    ];
    let mounted = false;
    let allowForce = true;

    onMount(() => init());

    const init = () => {
        addExtraCanvas();

        // reflections
        envMap = hdris[0];
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = envMap;

        renderer.compile(scene, camera);

        mounted = true;
    };

    const addExtraCanvas = () => {
        const section2 = document.getElementById("scene2");
        element = document.createElement("div");
        // element.addEventListener("click", applyForce);
        element.className = "scene2-extra-canvas";
        section2?.appendChild(element);
    };

    const random = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
    };

    // Function to check if an object is inside the camera frustum
    const isObjectInCameraFrustum = (object: any) => {
        var frustum = new THREE.Frustum();
        var cameraViewProjectionMatrix = new THREE.Matrix4();

        // Update the camera's matrixWorldInverse and matrixWorld
        camera.updateMatrixWorld();
        camera.matrixWorld.invert();

        // Combine the camera's projection and view matrix
        cameraViewProjectionMatrix.multiplyMatrices(
            camera.projectionMatrix,
            camera.matrixWorldInverse
        );

        // Set the frustum's matrix to the combined matrix
        frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

        // Check if the object is inside the frustum
        return frustum.intersectsObject(object);
    };

    const applyForce = () => {
        if (!allowForce) return;

        allowForce = false;
        spheres.forEach((f: THREE.Object3D) => {
            const s = f.userData.body;
            s.force.set(s.position.x, s.position.y, 0).normalize();
            s.velocity = s.force.scale(Math.random() * 10);
        });

        setTimeout(() => (allowForce = true), 1000);
    };

    const loop = () => {
        if (!enabled) return;
        if (!mounted) return;

        world.fixedStep();

        const date = Date.now();

        requestAnimationFrame(loop);

        const ROTATE_TIME = 10; // Time in seconds for a full rotation
        const xAxis = new THREE.Vector3(1, 0, 0);
        const yAxis = new THREE.Vector3(0, 1, 0);
        const rotateX = (date / ROTATE_TIME) * Math.PI * 2;
        const rotateY = (date / ROTATE_TIME) * Math.PI * 2;

        for (let index = 0; index < spheres.length; index++) {
            const f = spheres[index];

            // rotate
            f.rotateOnWorldAxis(xAxis, rotateX);
            f.rotateOnWorldAxis(yAxis, rotateY);

            // physics
            f.userData.body.position.x += f.userData.velocity.x;
            f.userData.body.position.y += f.userData.velocity.y;
            f.userData.body.position.z += f.userData.velocity.z;

            // Copy coordinates from Cannon to Three.js
            f.position.copy(f.userData.body.position);
            f.quaternion.copy(f.userData.body.quaternion);

            // boundaries
            if (!isObjectInCameraFrustum(f)) {
                f.userData.gravity = true;
            } else if (isObjectInCameraFrustum(f)) {
                f.userData.gravity = false;
            }
        }
    };
</script>

<Background
    bind:ref={background}
    {scene}
    color={0x88d0e3}
    position={new Vector3(0, 0, -25)}
/>

<SpotLight
    {scene}
    color={0xffffff}
    intensity={100}
    distance={100}
    angle={1}
    decay={1}
    position={new Vector3(-6, 0, 0)}
/>

{#each spawnSpheres as spawn}
    <Sphere
        {scene}
        {envMap}
        position={spawn.position}
        radius={spawn.radius}
        on:mount={(e) => {
            spheres.push(e.detail.ref);
            world.addBody(e.detail.ref.userData.body);
            world.addEventListener("postStep", () => {
                if (!e.detail.ref.userData.gravity) return;

                // pull sphere back to scene
                const s = e.detail.ref.userData.body;
                const v = new CANNON.Vec3();
                v.set(-s.position.x, -s.position.y, -s.position.z).normalize();
                v.scale(0.1, s.force);
                s.applyLocalForce(v);
            });
        }}
    />
{/each}
