<script lang="ts">
    import * as THREE from "three";
    import { Vector3 } from "three";
    import Sphere from "$lib/Sphere.svelte";
    import { createEventDispatcher, onMount } from "svelte";
    import Background from "$lib/Background.svelte";
    import SpotLight from "$lib/SpotLight.svelte";
    import * as CANNON from "cannon-es";
    import data from "../../data/spheres.json";

    export let renderer: THREE.WebGLRenderer;
    export let hdris: any[] = [];
    export let enabled: boolean;
    export let section2AnimComplete: boolean;

    $: enabled, loop();
    $: enabled, tone();
    $: section2AnimComplete, toggleExtraCanvas();
    $: hdris, hdr();

    let canvas: any;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        0.01,
        1000,
    );
    camera.position.set(0, 0, 20);
    scene.add(camera);
    scene.userData.camera = camera;
    scene.userData.scene = 2;

    const dispatch = createEventDispatcher();
    let envMap: any;
    let spheres: THREE.Object3D[] = [];
    const world = new CANNON.World();
    const blueMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#3897a9"),
        emissive: new THREE.Color("#3897a9"),
        roughness: 1,
        metalness: 1,
    });

    const blackMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#000000"),
        emissive: new THREE.Color("#000000"),
        roughness: 1, // matte appearance
        metalness: 0,
    });

    const transparentMaterial = new THREE.MeshPhysicalMaterial({
        transmission: 1,
        roughness: 0,
        reflectivity: 1,
        ior: 1.2,
        thickness: 10,
    });

    let spawnSpheres: any[] = [];
    let mounted = false;
    let allowForce = true;

    onMount(() => init());

    const init = () => {
        canvas = document.getElementById("scene2-canvas");

        scene.background = new THREE.Color("#ffffff");

        data.spheres.forEach((f) => {
            let material = blueMaterial;
            if (f.material == 2) material = blackMaterial;
            else if (f.material == 3) material = transparentMaterial;

            spawnSpheres.push({
                position: new THREE.Vector3(f.x, f.y, f.z),
                radius: f.radius,
                material: material,
            });
        });

        setViewport();

        renderer.compile(scene, camera);

        mounted = true;

        dispatch("mount", { scene });
    };

    const hdr = () => {
        if (!hdris || hdris.length == 0) return;

        // reflections
        envMap = hdris[0];
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = envMap;
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
            camera.matrixWorldInverse,
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

    const tone = () => {
        if (!enabled) return;

        renderer.toneMappingExposure = 1;
    };

    const setViewport = () => {
        if (window.innerWidth < 1600) {
            scene.userData.viewport = false;
            return;
        }

        // get its position relative to the page's viewport
        const rect = canvas.getBoundingClientRect();

        // set the viewport
        const width = rect.right - rect.left;
        const height = rect.bottom - rect.top;
        const left = rect.left;
        const bottom = renderer.domElement.clientHeight - rect.bottom;

        scene.userData.viewport = true;
        scene.userData.width = width;
        scene.userData.height = height;
        scene.userData.left = left;
        scene.userData.bottom = bottom;
    };

    const resize = () => {
        if (!enabled) return;

        renderer.domElement.resize(renderer, camera);
    };

    const toggleExtraCanvas = () => {
        if (!canvas) return;

        canvas.style.display =
            enabled && section2AnimComplete ? "block" : "none";
    };

    const loop = () => {
        if (!enabled) return;

        requestAnimationFrame(loop);

        world.fixedStep();

        const date = Date.now();

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

        setViewport();
    };
</script>

<svelte:window
    on:resize={() => resize()}
    on:orientationchange={() => resize()}
/>

<Background {scene} color={0x88d0e3} position={new Vector3(0, 0, -25)} />

<SpotLight
    {scene}
    color={0xffffff}
    intensity={100}
    distance={100}
    angle={1}
    decay={2}
    position={new Vector3(-6, 0, 0)}
/>

{#each spawnSpheres as spawn}
    <Sphere
        {scene}
        {envMap}
        position={spawn.position}
        radius={spawn.radius}
        material={spawn.material}
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
