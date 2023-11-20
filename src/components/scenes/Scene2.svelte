<script lang="ts">
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    // @ts-ignore
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
    import Background from "$lib/Background.svelte";
    import DirectionalLight from "$lib/DirectionalLight.svelte";
    import Fog from "$lib/Fog.svelte";
    import PointLight from "$lib/PointLight.svelte";
    import SpotLight from "$lib/SpotLight.svelte";
    import { createEventDispatcher, onMount } from "svelte";
    import * as THREE from "three";
    import { Vector3 } from "three";

    export let models: any[] = [];
    export let textures: any[] = [];
    export let hdris: any[] = [];
    export let renderer: THREE.WebGLRenderer;
    export let camera: THREE.PerspectiveCamera;
    export let scrollY: number;
    export let enabled: boolean;
    $: enabled, resize();
    $: enabled, loop();
    $: enabled, tone();

    onMount(() => init());
    const dispatch = createEventDispatcher();
    const scene = new THREE.Scene();
    let mounted = false;
    const cameraZ = 25;
    const fovLandscape = 70;
    const fovPortrait = 105;
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        30000
    );
    camera.position.set(0, 7, cameraZ);
    scene.add(camera);
    scene.userData.camera = camera;
    scene.userData.scene = 2;

    const init = () => {
        gsap.registerPlugin(ScrollTrigger);

        animateOnScroll();

        mounted = true;

        renderer.compile(scene, camera);

        dispatch("mount", { scene });
    };

    const animateOnScroll = () => {
        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: "#scene2",
                start: "top top",
                end: "+=" + window.innerHeight / 2,
                scrub: true,
            },
        }).to(camera.position, {
            x: camera.position.x,
            y: camera.position.y,
            z: cameraZ - 10,
        });
    };

    const resize = () => {
        if (!enabled) return;

        if (window.innerHeight > window.innerWidth) {
            camera.fov = fovPortrait;
        } else {
            camera.fov = fovLandscape;
        }

        renderer.domElement.resize(renderer, camera);
    };

    const tone = () => {
        if (!enabled) return;

        renderer.toneMapping = THREE.NoToneMapping;
        // renderer.toneMappingExposure = 1;
    };

    const loop = () => {
        if (!enabled) return;

        requestAnimationFrame(loop);
    };
</script>

<svelte:window
    on:resize={() => resize()}
    on:orientationchange={() => resize()}
/>

<!-- <Fog {scene} color={0x000000} near={cameraZ - 5} far={cameraZ} /> -->
