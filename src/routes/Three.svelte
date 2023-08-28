<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    // @ts-ignore
    import WebGL from "three/addons/capabilities/WebGL.js";
    // @ts-ignore
    import * as THREE from "three";
    // @ts-ignore
    import Stats from "three/addons/libs/stats.module";

    import Loading from "$lib/Loading.svelte";
    import Parallax from "./Parallax.svelte";
    import Cloud from "./Cloud.svelte";
    import Stars from "./Stars.svelte";
    import Sparkles from "./Sparkles.svelte";
    import Lines from "./Lines.svelte";
    import GodRays from "./GodRays.svelte";
    import Scene1 from "./Scene1.svelte";
    import Scene2 from "./Scene2.svelte";
    import type { SceneFX } from "$lib/SceneFX";

    export let scrollPercent = 0;
    export let scrollY = 0;
    export let totalHeight = 1;

    let message: string;
    let dispatch = createEventDispatcher();
    let canvas: HTMLCanvasElement;
    let renderer: THREE.WebGLRenderer;
    let stats: any;
    let loading: boolean = true;
    let weblAvailable: boolean = false;

    const totalScenes = 2;
    let scenes: SceneFX[] = [];

    onMount(() => {
        weblAvailable = WebGL.isWebGLAvailable();
        if (!weblAvailable) {
            const warning = WebGL.getWebGLErrorMessage();
            message = warning.innerText;
            loading = false;
            return;
        }

        init();

        window.onresize = () => onResize();
        onResize();

        requestAnimationFrame(loop);
    });

    onDestroy(() => {
        if (stats) document.body.removeChild(stats.dom);
    });

    const init = () => {
        // renderer
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
        });

        renderer.toneMapping = THREE.NoToneMapping;
        renderer.outputColorSpace = THREE.SRGBColorSpace; // optional with post-processing
        renderer.setClearColor(0x0e1215);

        // shadows
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // stats
        stats = new Stats();
        document.body.appendChild(stats.dom);
    };

    const onResize = () => {
        scenes?.forEach((f) => f.resize(canvas, renderer));
    };

    const loop = () => {
        requestAnimationFrame(loop);

        stats.update();

        if (loading && scenes?.length == totalScenes) {
            dispatch("mount");
            loading = false;
        }

        scenes?.forEach((f) => {
            if (scrollPercent >= f.start && scrollPercent < f.end)
                f.render(renderer, false, scrollPercent);
        });
    };
</script>

<canvas bind:this={canvas} />

{#if loading}
    <Loading />
{/if}
{#if weblAvailable}
    <div class:hide={loading}>
        <span class="scroll">Scroll progress: {scrollPercent?.toFixed(2)}%</span
        >
        <Scene1
            {canvas}
            {renderer}
            on:mount={(f) => scenes.push(f.detail.sceneFX)}
            {scrollPercent}
            {scrollY}
            {totalHeight}
        />
        <Scene2
            {canvas}
            {renderer}
            {scrollPercent}
            {scrollY}
            {totalHeight}
            on:mount={(f) => scenes.push(f.detail.sceneFX)}
        />

        <!-- <Parallax {camera} /> -->
        <!-- <Cloud {renderer} {scene} on:mount /> -->
        <!-- <Stars
            bind:this={stars}
            {renderer}
            {scene}
            {camera}
            {sparklesGeometry}
            {sparklesMaterial}
        /> -->
        <!-- <Sparkles {sparklesGeometry} {scene} object={monitor} /> -->
        <!-- <Lines {scene} object={monitor} /> -->
        <!-- <GodRays bind:this={godRays} {camera} {renderer} {scene} /> -->
    </div>
{/if}
{#if message}
    <p class="message">{message}</p>
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
