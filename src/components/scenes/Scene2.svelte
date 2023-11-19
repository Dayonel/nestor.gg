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
    import Subscene2 from "../Subscene2.svelte";

    export let models: any[] = [];
    export let textures: any[] = [];
    export let hdris: any[] = [];
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
    $: enabled, tone();
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
    const camera2 = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
    );
    camera2.position.set(0, 0, 20);
    scene2.add(camera2);
    let element: HTMLElement;
    let extraCanvasVisible = false;
    let loopingExtra = false;

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

        camera2.aspect = width / height; // not changing in this example
        camera2.updateProjectionMatrix();
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

        renderer.render(scene2, camera2);

        loopingExtra = true;
    };
</script>

<svelte:window
    on:resize={() => resize()}
    on:orientationchange={() => resize()}
/>

<!-- <Fog {scene} color={0x000000} near={cameraZ - 5} far={cameraZ} /> -->

<Subscene2
    scene={scene2}
    camera={camera2}
    {renderer}
    bind:element
    {hdris}
    enabled={enabled && extraCanvasVisible}
/>

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
            right: 14rem;
            transform: translateY(-50%);
            top: 50%;
            bottom: 0;
        }
    }
</style>
