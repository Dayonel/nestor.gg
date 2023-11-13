<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { Vector3 } from "three";
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    // @ts-ignore
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
    import Fog from "$lib/Fog.svelte";
    import Sphere from "$lib/Sphere.svelte";
    import DirectionalLight from "$lib/DirectionalLight.svelte";

    export let renderer: THREE.WebGLRenderer;
    export let camera: THREE.PerspectiveCamera;
    export let scrollPercent: number;
    export let enabled: boolean;
    $: enabled, loop();
    $: enabled, resize();
    $: enabled, tone();

    const scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        30000
    );
    camera.position.set(0, 0, 15);
    camera.lookAt(0, 0, 0);
    let mounted = false;
    var clock = new THREE.Clock();
    let uniforms = THREE.UniformsUtils.merge([THREE.UniformsLib["fog"]]);
    uniforms.time = { type: "f", value: 1 };
    uniforms.diffuse = { type: "c", value: new THREE.Color(0x00ccff) };
    uniforms.secondColor = { type: "c", value: new THREE.Color(0xffffff) };
    uniforms.opacity = { type: "f", value: 1.0 };

    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById("noise-vs")?.textContent ?? "",
        fragmentShader: document.getElementById("noise-fs")?.textContent ?? "",
        fog: true,
    });

    let sphere1: any, sphere2: any;

    onMount(() => init());

    const init = () => {
        gsap.registerPlugin(ScrollTrigger);

        // var planeGeom = new THREE.BufferGeometry().setFromPoints([
        //     // front
        //     new THREE.Vector3(-1, 1, 1),
        //     new THREE.Vector3(0, -1, 0),
        //     new THREE.Vector3(1, 1, 1),
        //     // left
        //     new THREE.Vector3(-1, 1, -1),
        //     new THREE.Vector3(0, -1, 0),
        //     new THREE.Vector3(-1, 1, 1),
        //     // right
        //     new THREE.Vector3(1, 1, 1),
        //     new THREE.Vector3(0, -1, 0),
        //     new THREE.Vector3(1, 1, -1),
        //     // rear
        //     new THREE.Vector3(1, 1, -1),
        //     new THREE.Vector3(0, -1, 0),
        //     new THREE.Vector3(-1, 1, -1),

        //     // top
        //     new THREE.Vector3(-1, 1, -1),
        //     new THREE.Vector3(-1, 1, 1),
        //     new THREE.Vector3(1, 1, -1),

        //     new THREE.Vector3(1, 1, -1),
        //     new THREE.Vector3(-1, 1, 1),
        //     new THREE.Vector3(1, 1, 1),
        // ]);

        // var plane = new THREE.Mesh(planeGeom, material);
        // plane.scale.setScalar(4);
        // scene.add(plane);

        mounted = true;
    };

    const resize = () => {
        if (!enabled) return;

        renderer.domElement.resize(renderer, camera);
    };

    const tone = () => {
        if (!enabled) return;

        renderer.toneMapping = THREE.NoToneMapping;
    };

    const loop = () => {
        if (!enabled) return;

        requestAnimationFrame(loop);

        const time = clock.getElapsedTime() * 0.01;
        uniforms.time.value = time;

        if (mounted) {
            sphere1.material.uniforms.time.value = -time;
            sphere1.rotation.x = Math.sin(time * 0.7) * 500;
            sphere1.rotation.y = Math.sin(time * 0.3) * 500;

            sphere2.material.uniforms.time.value = time;
            sphere2.rotation.x = Math.sin(time * 0.8) * 500;
            sphere2.rotation.y = Math.sin(time * 0.2) * 500;
        }

        camera.position.y = (scrollPercent - 19) * -1;

        renderer.render(scene, camera);
    };
</script>

<svelte:window
    on:resize={() => resize()}
    on:orientationchange={() => resize()}
/>

<Sphere
    bind:ref={sphere1}
    {scene}
    color={0x0a0aff}
    secondColor={0xffffff}
    position={new Vector3(-10, -2, -5)}
    scale={3}
    {material}
/>

<Sphere
    bind:ref={sphere2}
    {scene}
    color={0x0a0aff}
    secondColor={0xffffff}
    position={new Vector3(7, -2, 0)}
    scale={3}
    {material}
/>

<Fog {scene} color={0x000000} near={10} far={25} />
