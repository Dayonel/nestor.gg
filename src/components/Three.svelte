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

    let weblAvailable = false;
    let canvas: HTMLCanvasElement;
    let renderer: THREE.WebGLRenderer;
    let camera: THREE.PerspectiveCamera;
    let stats: any;

    onMount(() => init());

    onDestroy(() => {
        if (stats) document.body.removeChild(stats.dom);
    });

    const init = () => {
        weblAvailable = WebGL.isWebGLAvailable();
        if (!weblAvailable) return;

        // renderer
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            // alpha: true,
            powerPreference: "high-performance",
        });

        renderer.toneMapping = THREE.NoToneMapping;
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        // shadows
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 2;

        camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.01,
            30000
        );

        // set aspect ratio
        canvas.resize(renderer, camera);

        // stats
        stats = new Stats();
        document.body.appendChild(stats.dom);

        loop();

        console.log("three has mounted");
    };

    const loop = () => {
        requestAnimationFrame(loop);

        stats.update();
    };
</script>

<svelte:window
    on:resize={() => canvas.resize(renderer, camera)}
    on:orientationchange={() => canvas.resize(renderer, camera)}
/>

<canvas bind:this={canvas} />
<span class="scroll">Scroll progress: {scrollPercent?.toFixed(2)}%</span>

{#if !weblAvailable}
    <p class="message">{WebGL.getWebGLErrorMessage()}</p>
{:else}
    <Scene1
        {models}
        {hdris}
        {textures}
        {renderer}
        {camera}
        enabled={scrollPercent >= 0 && scrollPercent <= 20}
    />
    <Scene2
        {models}
        {hdris}
        {textures}
        {renderer}
        {camera}
        enabled={scrollPercent >= 20 && scrollPercent <= 40}
    />
{/if}

<style>
    canvas {
        display: block;
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
    }

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
