<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    // @ts-ignore
    import WebGL from "three/addons/capabilities/WebGL.js";
    // @ts-ignore
    import * as THREE from "three";
    // @ts-ignore
    import Stats from "three/addons/libs/stats.module";
    // @ts-ignore
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

    import Loading from "$lib/Loading.svelte";
    import Parallax from "./Parallax.svelte";
    import Cloud from "./Cloud.svelte";
    import Animations from "./Animations.svelte";
    import Stars from "./Stars.svelte";
    import Sparkles from "./Sparkles.svelte";
    import Lines from "./Lines.svelte";
    import GodRays from "./GodRays.svelte";

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
    const fovLandscape = 70;
    const fovPortrait = 110;
    let godRays: any;

    onMount(async () => {
        try {
            weblAvailable = WebGL.isWebGLAvailable();
            if (!weblAvailable) {
                const warning = WebGL.getWebGLErrorMessage();
                message = warning.innerText;
                return;
            }

            prepareScene();
            await loadGeometry();

            window.onresize = () => onResize();

            requestAnimationFrame(loop);

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
        camera = new THREE.PerspectiveCamera(
            fovLandscape,
            width / height,
            1,
            3000
        );
        camera.position.set(0, 0, 200);
        scene.add(camera);

        // renderer
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
        });

        renderer.toneMapping = THREE.NoToneMapping;
        renderer.outputColorSpace = THREE.SRGBColorSpace; // optional with post-processing
        onResize();

        // stats
        stats = new Stats();
        document.body.appendChild(stats.dom);
    };

    const loadGeometry = async () => {
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

        // amsterdam
        const gltfLoader = new GLTFLoader();
        const model1 = (await gltfLoader.loadAsync("models/amsterdam1.gltf"))
            .scene;
        model1.position.set(-125, -115, 0);
        model1.scale.multiplyScalar(15);
        scene.add(model1);

        const model2 = (await gltfLoader.loadAsync("models/amsterdam2.gltf"))
            .scene;
        model2.position.set(-50, -115, 0);
        model2.scale.multiplyScalar(15);
        scene.add(model2);

        const model3 = (await gltfLoader.loadAsync("models/amsterdam3.gltf"))
            .scene;
        model3.position.set(25, -115, 0);
        model3.scale.multiplyScalar(15);
        scene.add(model3);

        const model4 = (await gltfLoader.loadAsync("models/amsterdam4.gltf"))
            .scene;
        model4.position.set(100, -115, 0);
        model4.scale.multiplyScalar(15);
        scene.add(model4);
    };

    const onResize = () => {
        if (canvas.clientHeight > canvas.clientWidth) camera.fov = fovPortrait;
        else camera.fov = fovLandscape;

        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        const pixelRatio = window.devicePixelRatio;
        const width = (canvas.clientWidth * pixelRatio) | 0;
        const height = (canvas.clientHeight * pixelRatio) | 0;
        renderer.setSize(width, height, false);

        // children functions
        stars?.onResize();
        godRays?.onResize();
    };

    const loop = () => {
        requestAnimationFrame(loop);

        if (godRays) godRays.loop();
        else renderer.render(scene, camera);

        stats.update();

        // children functions
        animations?.loop();
        stars?.loop();
    };
</script>

<canvas bind:this={canvas} />

{#if loading}
    <Loading />
{:else if weblAvailable}
    <span class="scroll">Scroll progress: {scrollPercent?.toFixed(2)}%</span>
    <div class:hide={loading}>
        <!-- <Parallax {camera} /> -->
        <!-- <Cloud {renderer} {scene} on:mount /> -->
        <!-- <Animations bind:this={animations} {scrollPercent} {camera} {scene} /> -->
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
        <GodRays bind:this={godRays} {camera} {renderer} {scene} />
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
