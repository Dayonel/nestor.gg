<script lang="ts">
    import { onDestroy } from "svelte";
    import WebGL from "three/examples/jsm/capabilities/WebGL.js";
    import * as THREE from "three";
    import Stats from "three/examples/jsm/libs/stats.module";
    import Scene1 from "./Scene1.svelte";
    import Scene2 from "./Scene2.svelte";

    export let models: any[] = [];
    export let materials: any[] = [];
    export let scrollPercent = 0;

    let weblAvailable = WebGL.isWebGLAvailable();
    let canvas: HTMLCanvasElement;
    let renderer: THREE.WebGLRenderer;
    let stats: any;
    let cameraZ: number;

    onDestroy(() => {
        if (stats) document.body.removeChild(stats.dom);
    });

    const init = () => {
        // renderer
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });

        renderer.toneMapping = THREE.NoToneMapping;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        // renderer.setClearColor(0x000000, 1);
        // renderer.useLegacyLights = true;

        // shadows
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // stats
        stats = new Stats();
        document.body.appendChild(stats.dom);
    };

    init();

    const loop = () => {
        if (!weblAvailable) return;

        requestAnimationFrame(loop);

        stats.update();
    };

    loop();
</script>

<canvas bind:this={canvas} />

{#if !weblAvailable}
    <p class="message">{WebGL.getWebGLErrorMessage()}</p>
{:else}
    <span class="scroll">Scroll progress: {scrollPercent?.toFixed(2)}%</span>
    {#if scrollPercent >= 0 && scrollPercent <= 20}
        <Scene1 {models} {materials} {canvas} {renderer} bind:cameraZ />
    {/if}
    <!-- <Scene2 {canvas} {renderer} /> -->
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
