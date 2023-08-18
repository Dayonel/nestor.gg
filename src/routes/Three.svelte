<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    // @ts-ignore
    import WebGL from "three/addons/capabilities/WebGL.js";
    // @ts-ignore
    import * as THREE from "three";
    // @ts-ignore
    import Stats from "three/addons/libs/stats.module";
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

    onMount(() => {
        if (!WebGL.isWebGLAvailable()) {
            const warning = WebGL.getWebGLErrorMessage();
            console.log(warning);
            message = warning.innerText;
            return;
        }

        prepareScene();
        addGeometry();
        addAnimationScripts();

        window.onscroll = () => {
            scrollPercent =
                ((document.documentElement.scrollTop ||
                    document.body.scrollTop) /
                    ((document.documentElement.scrollHeight ||
                        document.body.scrollHeight) -
                        document.documentElement.clientHeight)) *
                100;

            if (scrollPercent > 1) dispatch("hideScroll");
            else dispatch("showScroll");
        };

        window.onresize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        loop();

        dispatch("mount");
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
            antialias: false,
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
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

    const loop = () => {
        requestAnimationFrame(loop);

        playScrollAnimations();

        renderer.render(scene, camera);

        stats.update();
    };
</script>

<canvas bind:this={canvas} id="three" />
<Rotation {scene} {rotationEnabled} />
<span class="scrollProgress">Scroll Progress: {scrollPercent?.toFixed(2)}%</span
>
{#if message}
    <p class="message">{message}</p>
{/if}

<style>
    canvas {
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

    .scrollProgress {
        position: fixed;
        bottom: 1rem;
        left: 1rem;
    }
</style>
