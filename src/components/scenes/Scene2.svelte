<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import * as THREE from "three";
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    // @ts-ignore
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
    import Fog from "$lib/Fog.svelte";

    export let renderer: THREE.WebGLRenderer;
    export let camera: THREE.PerspectiveCamera;
    export let enabled: boolean;
    $: enabled, loop();
    $: enabled, resize();

    const scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        200
    );
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);

    onMount(() => init());

    const init = () => {
        gsap.registerPlugin(ScrollTrigger);

        setupScene();
    };

    const setupScene = () => {
        scene.children.length = 0;

        const geometry = new THREE.IcosahedronGeometry(1, 15);

        for (let i = 0; i < 250; i++) {
            const material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 1,
                roughness: 0.6,
                side: THREE.DoubleSide,
            });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.x = Math.random() * 10 - 5;
            sphere.position.y = Math.random() * 10 - 5;
            sphere.position.z = Math.random() * 10 - 5;
            sphere.position
                .normalize()
                .multiplyScalar(Math.random() * 8.0 + 2.0);
            sphere.scale.setScalar(Math.random() * Math.random() + 0.5);
            scene.add(sphere);
        }
    };

    const resize = () => {
        if (!enabled) return;

        renderer.domElement.resize(renderer, camera);
    };

    const loop = () => {
        if (!enabled) return;

        requestAnimationFrame(loop);

        renderer.render(scene, camera);
    };
</script>

<svelte:window
    on:resize={() => resize()}
    on:orientationchange={() => resize()}
/>

<Fog {scene} color={0x000099} near={20} far={25} />
