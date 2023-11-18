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
    export let renderer: THREE.WebGLRenderer;
    export let camera: THREE.PerspectiveCamera;
    export let scrollY: number;
    export let section2AnimComplete = false;
    export let section2AnimBackwards = false;
    export let enabled: boolean;
    $: enabled, scissors();
    $: section2AnimBackwards, backwards();
    $: section2AnimComplete, showExtraCanvas();
    $: enabled, resize();
    $: enabled, loop();
    $: enabled, showExtraCanvas();

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

    const scene2 = new THREE.Scene();
    let element: HTMLElement;
    let elementScene2: HTMLElement;
    let extraCanvasVisible = false;
    let loopingExtra = false;

    const init = () => {
        gsap.registerPlugin(ScrollTrigger);

        animateOnScroll();

        addExtraCanvas();

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

    const addExtraCanvas = () => {
        const section2 = document.getElementById("scene2");
        element = document.createElement("div");
        element.className = "scene2-extra-canvas";
        section2?.appendChild(element);

        scene2.background = new THREE.Color("#ffffff");
    };

    const showExtraCanvas = () => {
        if (!section2AnimComplete) return;
        if (!element) return;

        extraCanvasVisible = true;
        element.style.display = "block";

        if (!loopingExtra) loopExtra();
    };

    const backwards = () => {
        if (!section2AnimBackwards) return;
        if (!element) return;

        element.style.display = "none";
        extraCanvasVisible = false;
    };

    const scissors = () => {
        if (!enabled) renderer.setScissorTest(false);
    };

    const resetViewport = () => {
        if (!element) return;

        // get its position relative to the page's viewport
        const rect = element.getBoundingClientRect();

        // set the viewport
        const width = rect.right - rect.left;
        const height = rect.bottom - rect.top;
        const left = rect.left;
        const bottom = renderer.domElement.clientHeight - rect.bottom;

        renderer.setViewport(left, bottom, width, height);
        renderer.setScissor(left, bottom, width, height);
    };

    const loop = () => {
        if (!enabled) return;

        requestAnimationFrame(loop);
    };

    const loopExtra = () => {
        if (!enabled || !extraCanvasVisible) {
            loopingExtra = false;
            return;
        }

        requestAnimationFrame(loopExtra);

        renderer.setScissorTest(true);
        resetViewport();
        renderer.render(scene2, camera);

        loopingExtra = true;
    };
</script>

<svelte:window
    on:resize={() => resize()}
    on:orientationchange={() => resize()}
/>

<div bind:this={elementScene2} class="scene2">
    <Background {scene} color={0xc22fca} position={new Vector3(0, 0, -5)} />

    <!-- Static lights -->
    <PointLight
        {scene}
        color={0xff0000}
        intensity={50}
        position={new Vector3(-10, 10, 10)}
    />

    <PointLight
        {scene}
        color={0x0000ff}
        intensity={50}
        position={new Vector3(0, 10, 10)}
    />

    <PointLight
        {scene}
        color={0xff0000}
        intensity={50}
        position={new Vector3(10, 10, 10)}
    />

    <SpotLight
        {scene}
        color={0xffffff}
        intensity={2000}
        position={new Vector3(0, 50, -1)}
    />

    <DirectionalLight
        {scene}
        color={0xf2f2f2}
        intensity={0.12}
        position={new Vector3(-1, 1.75, 1)}
        scale={30}
    />

    <Fog {scene} color={0x000000} near={cameraZ - 5} far={cameraZ} />
</div>

<style>
    :global(.scene2-extra-canvas) {
        display: block;
        width: 90dvw;
        height: 50dvh;
        -webkit-border-radius: 16px;
        -moz-border-radius: 16px;
        border-radius: 16px;
        -webkit-box-shadow: 0px 0px 0px 16px #000000;
        -moz-box-shadow: 0px 0px 0px 16px #000000;
        box-shadow: 0px 0px 0px 16px #000000;
        position: absolute;
        bottom: 3rem;
        padding: 3rem;
    }

    @media (min-width: 1600px) {
        :global(.scene2-extra-canvas) {
            display: none;
            height: 90dvh;
            width: 600px;
            right: 5rem;
            transform: translate(-8dvw, -50%);
            top: 50%;
            bottom: 0;
        }
    }
</style>
