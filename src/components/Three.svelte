<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import WebGL from "three/examples/jsm/capabilities/WebGL.js";
    import * as THREE from "three";
    import Stats from "three/examples/jsm/libs/stats.module";
    import Scene1 from "./scenes/Scene1.svelte";
    import Scene2 from "./scenes/Scene2.svelte";

    export let models: any[] = [];
    export let hdris: any[] = [];
    export let textures: any[] = [];
    export let scrollPercent = 0;
    export let scrollY = 0;
    export let currentScene: number = 1;
    $: currentScene, transitionScene();

    let weblAvailable = false;
    let renderer: THREE.WebGLRenderer;
    let camera: THREE.PerspectiveCamera;
    let stats: any;
    let canvas: HTMLCanvasElement;
    let scene: number = 1;

    onMount(() => init());

    onDestroy(() => {
        if (stats) document.body.removeChild(stats.dom);
    });

    const init = () => {
        weblAvailable = WebGL.isWebGLAvailable();
        if (!weblAvailable) return;

        // renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });

        renderer.outputColorSpace = THREE.SRGBColorSpace;

        // shadows
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.01,
            30000
        );

        canvas = document.body.appendChild(renderer.domElement);

        // stats
        stats = new Stats();
        document.body.appendChild(stats.dom);

        loop();

        console.log("three has mounted");
    };

    const toggleScene = async () => {
        if (!canvas) return;

        canvas.style.opacity = "0";
        await delay(250);
        canvas.style.opacity = "1";
        scene = currentScene;
    };

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const transitionScene = async () => {
        await toggleScene();
    };

    const loop = () => {
        requestAnimationFrame(loop);

        stats.update();
    };
</script>

<span class="scroll">Scroll progress: {scrollPercent?.toFixed(2)}%</span>

{#if !weblAvailable}
    <p class="message">{WebGL.getWebGLErrorMessage()}</p>
{:else}
    <Scene1 {models} {renderer} {camera} {scrollY} enabled={scene == 1} />
    <Scene2 {renderer} {camera} {scrollY} enabled={scene == 2} />
{/if}

<style>
    .message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-weight: 300;
    }

    .scroll {
        position: fixed;
        top: 1rem;
        right: 1rem;
    }
</style>
