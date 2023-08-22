<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    // @ts-ignore
    import WebGL from "three/addons/capabilities/WebGL.js";
    // @ts-ignore
    import * as THREE from "three";
    // @ts-ignore
    import Stats from "three/addons/libs/stats.module";
    // @ts-ignore
    import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

    import Loading from "$lib/Loading.svelte";
    import Rotation from "./Rotation.svelte";
    import Cloud from "./Cloud.svelte";
    import Animations from "./Animations.svelte";
    import Stars from "./Stars.svelte";
    import Sparkles from "./Sparkles.svelte";

    export let scrollPercent = 0;

    let message: string;
    let dispatch = createEventDispatcher();
    let canvas: HTMLCanvasElement;
    let scene: THREE.Scene = new THREE.Scene();
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let stats: any;
    let loading: boolean = true;
    let weblAvailable: boolean = false;
    let sparklesGeometry: THREE.BufferGeometry;
    let sparklesMaterial: THREE.ShaderMaterial;
    let monitor: any;
    let stars: any;
    let animations: any;
    let sparkles1: any;

    onMount(async () => {
        try {
            weblAvailable = WebGL.isWebGLAvailable();
            if (!weblAvailable) {
                const warning = WebGL.getWebGLErrorMessage();
                message = warning.innerText;
                return;
            }

            prepareScene();
            await addGeometry();

            window.onresize = () => onResize();

            loop(0);

            dispatch("mount");
        } finally {
            loading = false;
        }
    });

    onDestroy(() => {
        if (stats) document.body.removeChild(stats.dom);
    });

    const prepareScene = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // camera
        let fov = 40;
        camera = new THREE.PerspectiveCamera(fov, width / height, 0.01, 1000);
        camera.position.set(0, 1.6, 8); // 8
        camera.rotation.set(THREE.MathUtils.degToRad(-10), 0, 0);
        scene.add(camera);

        // renderer
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
        });

        // renderer.setClearColor(0x101010, 1);
        renderer.toneMapping = THREE.NoToneMapping;
        renderer.outputColorSpace = THREE.SRGBColorSpace; // optional with post-processing
        onResize();

        // stats
        stats = new Stats();
        document.body.appendChild(stats.dom);
    };

    const addGeometry = async () => {
        const loader = new THREE.TextureLoader();
        // sparkles
        sparklesGeometry = new THREE.BufferGeometry();
        sparklesMaterial = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: {
                    value: await loader.loadAsync("dotTexture.png"),
                },
            },
            vertexShader: document.getElementById("sparkles-vs")?.textContent,
            fragmentShader: document.getElementById("sparkles-fs")?.textContent,
            blending: THREE.AdditiveBlending,
            alphaTest: 1.0,
            transparent: true,
        });

        // monitor
        const objLoader = new OBJLoader();
        const object = await objLoader.loadAsync("models/monitor.obj");
        object.children[0].geometry.translate(0, 0, 4);
        const children = object.getObjectByName("monitor");
        monitor = children;
    };

    const onResize = () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        const pixelRatio = window.devicePixelRatio;
        const width = (canvas.clientWidth * pixelRatio) | 0;
        const height = (canvas.clientHeight * pixelRatio) | 0;
        renderer.setSize(width, height, false);

        // children functions
        stars?.onResize();
    };

    const loop = (time: number) => {
        requestAnimationFrame(loop);

        renderer.render(scene, camera);

        stats.update();

        // children functions
        animations?.loop();
        stars?.loop();
        sparkles1?.loop(time);
    };
</script>

<canvas bind:this={canvas} />

{#if loading}
    <Loading />
{:else if weblAvailable}
    <span class="scroll">Scroll progress: {scrollPercent?.toFixed(2)}%</span>
    <div class:hide={loading}>
        <!-- <Rotation {scene} {rotationEnabled} /> -->
        <!-- <Cloud {renderer} {scene} on:mount /> -->
        <!-- <Animations bind:this={animations} {scrollPercent} {camera} {scene} /> -->
        <Stars
            bind:this={stars}
            {renderer}
            {scene}
            {camera}
            {sparklesGeometry}
            {sparklesMaterial}
        />
        <Sparkles
            bind:this={sparkles1}
            {sparklesGeometry}
            {scene}
            object={monitor}
        />
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
