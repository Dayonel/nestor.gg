<script lang="ts">
    import * as THREE from "three";
    import { Vector3 } from "three";
    import Sphere from "$lib/Sphere.svelte";
    import { createEventDispatcher, onMount } from "svelte";
    import Background from "$lib/Background.svelte";
    import SpotLight from "$lib/SpotLight.svelte";
    import PointLight from "$lib/PointLight.svelte";
    import * as CANNON from "cannon-es";
    import data from "../../data/spheres.json";
    import Fog from "$lib/Fog.svelte";
    import DirectionalLight from "$lib/DirectionalLight.svelte";

    export let renderer: THREE.WebGLRenderer;
    export let hdris: any[] = [];
    export let enabled: boolean;
    export let textures: any[] = [];

    $: enabled, loop();
    $: enabled, tone();
    $: enabled, resize();
    $: hdris, hdr();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        0.01,
        1000,
    );
    const cameraZ = 25;
    camera.position.set(0, 0, cameraZ);
    scene.add(camera);
    scene.userData.camera = camera;
    scene.userData.scene = 4;

    const dispatch = createEventDispatcher();
    // let envMap: any;
    let spheres: THREE.Object3D[] = [];
    const world = new CANNON.World();
    const blueMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#000000"),
        // emissive: new THREE.Color("#3897a9"),
        roughness: 0.5,
        // metalness: 1,
    });

    const blackMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#000000"),
        // emissive: new THREE.Color("#000000"),
        roughness: 0.5, // matte appearance
        // metalness: 0,
    });

    const transparentMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#000000"),
        // emissive: new THREE.Color("#000000"),
        roughness: 0.5, // matte appearance
        // metalness: 0,
    });

    let spawnSpheres: any[] = [];
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
    let mounted = false;
    let allowForce = true;
    let light1: any, light2: any, light3: any, light4: any;

    onMount(() => init());

    const init = () => {
        renderer.compile(scene, camera);

        mounted = true;

        dispatch("mount", { scene });
    };

    const hdr = () => {
        if (!hdris || hdris.length == 0) return;

        // reflections
        // envMap = hdris[0];
        // envMap.mapping = THREE.EquirectangularReflectionMapping;
        // scene.environment = envMap;
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
    };

    const resize = () => {
        if (!enabled) return;

        renderer.domElement.resize(renderer, camera);
    };

    const loop = () => {
        if (!enabled) return;

        requestAnimationFrame(loop);

        world.fixedStep();

        const now = Date.now();

        const ROTATE_TIME = 10; // Time in seconds for a full rotation
        const xAxis = new THREE.Vector3(1, 0, 0);
        const yAxis = new THREE.Vector3(0, 1, 0);
        const rotateX = (now / ROTATE_TIME) * Math.PI * 2;
        const rotateY = (now / ROTATE_TIME) * Math.PI * 2;

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

        if (mounted) {
            const z = 40;
            const time = now * 0.0005;
            light1.position.x = Math.sin(time * 0.7) * 30;
            light1.position.y = Math.cos(time * 0.5) * 40;
            light1.position.z = Math.cos(time * 0.3) * z;

            light2.position.x = Math.cos(time * 0.3) * 30;
            light2.position.y = Math.sin(time * 0.5) * 40;
            light2.position.z = Math.sin(time * 0.7) * z;

            light3.position.x = Math.sin(time * 0.7) * 30;
            light3.position.y = Math.cos(time * 0.3) * 40;
            light3.position.z = Math.sin(time * 0.5) * z;

            light4.position.x = Math.sin(time * 0.3) * 30;
            light4.position.y = Math.cos(time * 0.7) * 40;
            light4.position.z = Math.sin(time * 0.5) * z;
        }
    };
</script>

<svelte:window
    on:resize={() => resize()}
    on:orientationchange={() => resize()}
/>

{#each spawnSpheres as spawn}
    <Sphere
        {scene}
        material={spawn.material}
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

<!-- <Background {scene} color={0xc22fca} position={new Vector3(0, 0, -5)} /> -->

<!-- Moving lights -->
<PointLight bind:ref={light1} {scene} color={0xff0040} intensity={500} />
<PointLight bind:ref={light2} {scene} color={0x0040ff} intensity={500} />
<PointLight bind:ref={light3} {scene} color={0x80ff80} intensity={500} />
<PointLight bind:ref={light4} {scene} color={0xffaa00} intensity={500} />

<Fog {scene} color={0x000000} near={cameraZ - 5} far={cameraZ} />
