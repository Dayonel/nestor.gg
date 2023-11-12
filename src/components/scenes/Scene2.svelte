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
    export let enabled: boolean;
    $: enabled, loop();
    $: enabled, resize();
    $: enabled, tone();

    const scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        0.1,
        30000
    );
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);
    let mounted = false;
    var uniforms: any;
    var clock = new THREE.Clock();

    let sphere1: any;

    onMount(() => init());

    const init = () => {
        gsap.registerPlugin(ScrollTrigger);

        var planeGeom = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector2(-1, 1),
            new THREE.Vector2(0, -1),
            new THREE.Vector2(1, 1),
        ]);
        planeGeom.setAttribute(
            "uv",
            new THREE.Float32BufferAttribute([0, 1, 0.5, 0, 1, 1], 2)
        );

        uniforms = {
            time: { type: "f", value: 1 },
            diffuse: { type: "c", value: new THREE.Color(0x00ccff) },
            opacity: { type: "f", value: 1.0 },
        };

        var planeMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader:
                document.getElementById("noise-vs")?.textContent ?? "",
            fragmentShader:
                document.getElementById("noise-fs")?.textContent ?? "",
        });

        var plane = new THREE.Mesh(planeGeom, planeMat);
        plane.scale.setScalar(4);
        scene.add(plane);

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

        // const now = Date.now();
        // const time = now * 0.0005;

        // if (mounted) {
        //     sphere1.rotation.y = Math.sin(time * 0.7) * 30;
        // }

        uniforms.time.value = clock.getElapsedTime() * 0.125;

        renderer.render(scene, camera);
    };
</script>

<svelte:window
    on:resize={() => resize()}
    on:orientationchange={() => resize()}
/>

<DirectionalLight
    {scene}
    color={0xf2f2f2}
    intensity={10}
    position={new Vector3(0, 0, 10)}
    scale={100}
/>

<!-- <Sphere
    bind:ref={sphere1}
    {scene}
    color={0x000099}
    position={new Vector3(-2, -1, 2)}
    scale={3}
/> -->
<!-- <Fog {scene} color={0x000099} near={20} far={25} /> -->
