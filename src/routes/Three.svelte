<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    // @ts-ignore
    import WebGL from "three/addons/capabilities/WebGL.js";
    // @ts-ignore
    import * as THREE from "three";
    // @ts-ignore
    import Stats from "three/addons/libs/stats.module";
    import TWEEN from "@tweenjs/tween.js";

    import Loading from "$lib/Loading.svelte";
    import Parallax from "./Parallax.svelte";
    import Stars from "./Stars.svelte";
    import Sparkles from "./Sparkles.svelte";
    import Lines from "./Lines.svelte";
    import GodRays from "./GodRays.svelte";
    import Scene1 from "./Scene1.svelte";
    import Scene2 from "./Scene2.svelte";
    import type { SceneFX } from "$lib/SceneFX";

    export let scrollPercent = 0;

    let message: string;
    let dispatch = createEventDispatcher();
    let canvas: HTMLCanvasElement;
    let renderer: THREE.WebGLRenderer;
    let stats: any;
    let loading: boolean = true;
    let weblAvailable: boolean = false;
    let introAnimationCompleted: boolean;
    let animationIntro: any;
    let cameraZ: number;

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
            antialias: true,
            powerPreference: "high-performance",
        });

        renderer.toneMapping = THREE.NoToneMapping;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0x000000, 1);
        // renderer.useLegacyLights = true;

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

    const introAnimation = (scene: THREE.Scene) => {
        animationIntro = new TWEEN.Tween(scene.camera.position)
            .to(
                {
                    x: scene.camera.position.x,
                    y: scene.camera.position.y,
                    z: cameraZ - 10,
                },
                1000 // 2500
            ) // time take to animate
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => (introAnimationCompleted = true));
    };

    const loop = () => {
        if (!weblAvailable) return;

        requestAnimationFrame(loop);

        stats.update();

        if (!loading && !introAnimationCompleted) TWEEN.update();

        if (loading && scenes?.length == totalScenes) {
            dispatch("mount");
            animationIntro.start();
            loading = false;
        }

        scenes?.forEach((f) => {
            if (scrollPercent >= f.start && scrollPercent <= f.end) {
                renderer.render(f.scene, f.camera);
            }
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
            on:mount={(f) => {
                scenes.push(f.detail.sceneFX);
                introAnimation(f.detail.sceneFX);
            }}
            bind:cameraZ
        />
        <Scene2
            {canvas}
            {renderer}
            on:mount={(f) => scenes.push(f.detail.sceneFX)}
        />

        <!-- <Parallax {camera} /> -->
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
