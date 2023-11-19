<script lang="ts">
    import * as THREE from "three";
    import { Vector3 } from "three";
    import Sphere from "$lib/Sphere.svelte";
    import { onMount } from "svelte";
    import Background from "$lib/Background.svelte";
    import DirectionalLight from "$lib/DirectionalLight.svelte";

    export let renderer: THREE.WebGLRenderer;
    export let camera: THREE.PerspectiveCamera;
    export let scene: THREE.Scene;
    export let element: HTMLElement;
    export let hdris: any[] = [];
    export let enabled: boolean;
    $: enabled, loop();

    let envMap: any;
    let sphere1: any, sphere2: any;
    let spheres: any = [];
    let background: any;

    onMount(() => init());

    const init = () => {
        addExtraCanvas();

        envMap = hdris[0];
        envMap.mapping = THREE.EquirectangularReflectionMapping;

        scene.environment = envMap;

        renderer.compile(scene, camera);
    };

    const addExtraCanvas = () => {
        const section2 = document.getElementById("scene2");
        element = document.createElement("div");
        element.className = "scene2-extra-canvas";
        section2?.appendChild(element);
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

    const loop = () => {
        if (!enabled) return;

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

            // move
            f.position.add(f.userData.velocity);

            // reverse x
            if (f.userData.toggleX != true && !isObjectInCameraFrustum(f)) {
                f.userData.toggleX = true;
                f.userData.velocity.x *= -1;
                console.log("toggle X");
            } else if (
                f.userData.toggleX == true &&
                isObjectInCameraFrustum(f)
            ) {
                f.userData.toggleX = false;
            }

            // reverse y
            if (f.userData.toggleY != true && !isObjectInCameraFrustum(f)) {
                f.userData.toggleY = true;
                f.userData.velocity.y *= -1;
                console.log("toggle Y");
            } else if (
                f.userData.toggleY == true &&
                isObjectInCameraFrustum(f)
            ) {
                f.userData.toggleY = false;
            }
        }
    };
</script>

<Background
    bind:ref={background}
    {scene}
    color={0x88d0e3}
    position={new Vector3(0, 0, -5)}
/>

<DirectionalLight
    {scene}
    color={0xffffff}
    intensity={5}
    position={new Vector3(-1, 1.75, 1)}
    scale={30}
/>

<Sphere
    bind:ref={sphere1}
    {scene}
    {envMap}
    position={new Vector3(0, 0, 10)}
    on:mount={(e) => spheres.push(e.detail.ref)}
/>
<Sphere
    bind:ref={sphere2}
    {scene}
    {envMap}
    position={new Vector3(1, 0, 5)}
    on:mount={(e) => spheres.push(e.detail.ref)}
/>
