<script lang="ts">
    import * as THREE from "three";
    import { Vector3 } from "three";
    import Sphere from "$lib/Sphere.svelte";
    import { onMount } from "svelte";
    import Background from "$lib/Background.svelte";
    import SpotLight from "$lib/SpotLight.svelte";
    import * as CANNON from "cannon-es";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
    const clock = new THREE.Clock();

    const totalSpheres = Array.from(new Array(20).keys());
    const spherePositions: THREE.Vector3[] = [];
    const radius = 1;
    let mounted = false;
    let allowForce = true;

    onMount(() => init());

    const init = () => {
        addExtraCanvas();

        // const controls = new OrbitControls(camera, element);
        // controls.minDistance = 2;
        // controls.maxDistance = 5;
        // controls.enablePan = false;
        // controls.enableZoom = false;
        // scene.userData.controls = controls;

        totalSpheres.forEach(() => {
            let newPosition = new THREE.Vector3();
            // Place the object without collision
            do {
                newPosition.set(random(-6, 6), random(-6, 6), random(6, 7));
            } while (isColliding(newPosition));
            spherePositions.push(newPosition);
        });

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
        element.addEventListener("click", applyForce);
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

    // Function to check collision with other spheres
    function isColliding(position: THREE.Vector3) {
        for (var i = 0; i < spherePositions.length; i++) {
            var distance = position.distanceTo(spherePositions[i]);
            if (distance < radius + radius) {
                return true; // Collision detected
            }
        }
        return false; // No collision
    }

    const loop = () => {
        if (!enabled) return;
        if (!mounted) return;

        const delta = Math.min(clock.getDelta(), 0.1);
        world.step(delta);

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
            f.position.set(
                f.userData.body.position.x,
                f.userData.body.position.y,
                f.userData.body.position.z
            );

            // boundaries
            if (!isObjectInCameraFrustum(f)) {
                // Determine which axis is outside the frustum
                const position = f.position;
                const deltaX = Math.abs(position.x);
                const deltaY = Math.abs(position.y);

                if (deltaX > deltaY) {
                    // Reverse X axis
                    if (!f.userData.toggleX) {
                        f.userData.toggleX = true;
                        f.userData.velocity.x *= -1;
                    }
                } else {
                    // Reverse Y axis
                    if (!f.userData.toggleY) {
                        f.userData.toggleY = true;
                        f.userData.velocity.y *= -1;
                    }
                }
            } else {
                // Reset toggle flags when inside the frustum
                f.userData.toggleX = false;
                f.userData.toggleY = false;
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

{#each spherePositions as position}
    <Sphere
        {scene}
        {envMap}
        {position}
        on:mount={(e) => {
            spheres.push(e.detail.ref);
            world.addBody(e.detail.ref.userData.body);
            world.addEventListener("postStep", function () {
                const s = e.detail.ref.userData.body;
                const v = new CANNON.Vec3();
                v.set(-s.position.x, -s.position.y, -s.position.z).normalize();
                v.scale(9.8, s.force);
                s.applyLocalForce(v);
            });
        }}
    />
{/each}
