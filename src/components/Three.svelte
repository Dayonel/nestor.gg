<script lang="ts">
    import { onDestroy } from "svelte";
    import WebGL from "three/examples/jsm/capabilities/WebGL.js";
    import * as THREE from "three";
    import Stats from "three/examples/jsm/libs/stats.module";
    import Scene1 from "./scenes/Scene1.svelte";
    import Scene2 from "./scenes/Scene2.svelte";
    import Scene3 from "./scenes/Scene3.svelte";

    export let models: any[] = [];
    export let hdris: any[] = [];
    export let textures: any[] = [];
    export let scrollPercent = 0;
    export let scrollY = 0;
    export let section2AnimComplete = false;
    export let section2AnimBackwards = false;
    export let scene: number = 1;
    $: scene, renderer.clear();

    let weblAvailable = WebGL.isWebGLAvailable();
    let renderer: THREE.WebGLRenderer;
    let camera: THREE.PerspectiveCamera;
    let stats: any;
    let canvas: HTMLCanvasElement;
    const scenes: THREE.Scene[] = [];

    onDestroy(() => {
        if (stats) document.body.removeChild(stats.dom);
    });

    const init = () => {
        if (!weblAvailable) return;

        // renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });

        renderer.setPixelRatio(window.devicePixelRatio);
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

        console.log("three has mounted");
    };

    const loop = () => {
        requestAnimationFrame(loop);

        scenes?.forEach((f) => {
            if (f.userData.scene == scene) {
                renderer.setScissorTest(false);
                renderer.clear();
                renderer.setScissorTest(true);
                renderer.setViewport(
                    0,
                    0,
                    window.innerWidth,
                    window.innerHeight
                );
                renderer.setScissor(
                    0,
                    0,
                    window.innerWidth,
                    window.innerHeight
                );
                renderer.render(f, f.userData.camera);
            }
        });

        stats.update();
    };

    // this happens prior to chilren onMount()
    init();
    loop();
</script>

<span class="scroll">Scroll progress: {scrollPercent?.toFixed(2)}%</span>

{#if !weblAvailable}
    <p class="message">{WebGL.getWebGLErrorMessage()}</p>
{:else}
    <Scene1
        {models}
        {renderer}
        {camera}
        {scrollY}
        enabled={scene == 1}
        on:mount={(e) => scenes.push(e.detail.scene)}
    />
    <Scene2
        {models}
        {renderer}
        {camera}
        {scrollY}
        enabled={scene == 2}
        {textures}
        {section2AnimComplete}
        {section2AnimBackwards}
        on:mount={(e) => scenes.push(e.detail.scene)}
    />
    <Scene3
        {models}
        {renderer}
        {camera}
        {scrollY}
        enabled={scene == 3}
        {textures}
        on:mount={(e) => scenes.push(e.detail.scene)}
    />
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
