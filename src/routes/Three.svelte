<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    // @ts-ignore
    import WebGL from "three/addons/capabilities/WebGL.js";
    // @ts-ignore
    import * as THREE from "three";
    // @ts-ignore
    import Stats from "three/addons/libs/stats.module";
    import Loading from "$lib/Loading.svelte";
    import Rotation from "./Rotation.svelte";

    export let scrollPercent = 0;

    let message: string;
    let dispatch = createEventDispatcher();
    let canvas: HTMLCanvasElement;
    let scene: THREE.Scene = new THREE.Scene();
    let camera: THREE.PerspectiveCamera;
    let cameraGroup: THREE.Group = new THREE.Group();
    let renderer: THREE.WebGLRenderer;
    let stats: any;
    let cube: THREE.Mesh;
    let material: THREE.MeshBasicMaterial;
    const animationScripts: { start: number; end: number; func: () => void }[] =
        [];
    let rotationEnabled: boolean = true;
    let loading: boolean = true;
    let weblAvailable: boolean = false;

    onMount(() => {
        try {
            weblAvailable = WebGL.isWebGLAvailable();
            if (!weblAvailable) {
                const warning = WebGL.getWebGLErrorMessage();
                message = warning.innerText;
                return;
            }

            prepareScene();
            addGeometry();
            addAnimationScripts();

            window.onresize = () => {
                if (resizeRendererToDisplaySize()) {
                    camera.aspect = canvas.clientWidth / canvas.clientHeight;
                    camera.updateProjectionMatrix();
                }
            };

            loop();

            dispatch("mount");
        } finally {
            loading = false;
        }
    });

    onDestroy(() => {
        if (stats) document.body.removeChild(stats.dom);
    });

    const prepareScene = () => {
        // camera
        camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 2);
        cameraGroup.add(camera);
        scene.add(cameraGroup);

        // renderer
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
        });

        if (resizeRendererToDisplaySize()) {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        renderer.setClearColor(0x101010, 1);
        renderer.toneMapping = THREE.NoToneMapping;
        renderer.outputColorSpace = THREE.SRGBColorSpace; // optional with post-processing

        // stats
        stats = new Stats();
        document.body.appendChild(stats.dom);

        // grid helper
        const gridHelper = new THREE.GridHelper(10, 10, 0xaec6cf, 0xaec6cf);
        scene.add(gridHelper);
    };

    const addGeometry = () => {
        const geometry = new THREE.BoxGeometry();
        material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
        });

        cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 0.5, -10);
        scene.add(cube);
    };

    const lerp = (x: number, y: number, a: number): number => {
        return (1 - a) * x + a * y;
    };

    const scalePercent = (start: number, end: number) => {
        return (scrollPercent - start) / (end - start);
    };

    const addAnimationScripts = () => {
        //add an animation that flashes the cube through 100 percent of scroll
        animationScripts.push({
            start: 0,
            end: 101,
            func: () => {
                let g = material.color.g;
                g -= 0.05;
                if (g <= 0) {
                    g = 1.0;
                }
                material.color.g = g;
            },
        });

        //add an animation that moves the cube through first 40 percent of scroll
        animationScripts.push({
            start: 0,
            end: 40,
            func: () => {
                camera.lookAt(cube.position);
                camera.position.set(0, 1, 2);
                cube.position.z = lerp(-10, 0, scalePercent(0, 40));
                rotationEnabled = true;
            },
        });

        //add an animation that rotates the cube between 40-60 percent of scroll
        animationScripts.push({
            start: 40,
            end: 60,
            func: () => {
                camera.lookAt(cube.position);
                camera.position.set(0, 1, 2);
                cube.rotation.z = lerp(0, Math.PI, scalePercent(40, 60));
                rotationEnabled = true;
            },
        });

        //add an animation that moves the camera between 60-80 percent of scroll
        animationScripts.push({
            start: 60,
            end: 80,
            func: () => {
                camera.position.x = lerp(0, 5, scalePercent(60, 80));
                camera.position.y = lerp(1, 5, scalePercent(60, 80));
                camera.lookAt(cube.position);
                rotationEnabled = true;
            },
        });

        //add an animation that auto rotates the cube from 80 percent of scroll
        animationScripts.push({
            start: 80,
            end: 101,
            func: () => {
                //auto rotate
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
                rotationEnabled = false;
            },
        });
    };

    const playScrollAnimations = () => {
        animationScripts.forEach((a) => {
            if (scrollPercent >= a.start && scrollPercent < a.end) {
                a.func();
            }
        });
    };

    const resizeRendererToDisplaySize = () => {
        const pixelRatio = window.devicePixelRatio;
        const width = (canvas.clientWidth * pixelRatio) | 0;
        const height = (canvas.clientHeight * pixelRatio) | 0;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    };

    const loop = () => {
        requestAnimationFrame(loop);

        playScrollAnimations();

        renderer.render(scene, camera);

        stats.update();
    };
</script>

<canvas bind:this={canvas} />

{#if loading}
    <Loading />
{/if}
{#if message}
    <p class="message">{message}</p>
{/if}
{#if weblAvailable}
    <span class="scroll">Scroll progress: {scrollPercent?.toFixed(2)}%</span>
    <div class:hide={loading}>
        <Rotation {scene} {rotationEnabled} />
    </div>
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
        bottom: 1rem;
        left: 1rem;
    }
</style>
