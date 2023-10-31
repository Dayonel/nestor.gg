<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import * as THREE from "three";
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    // @ts-ignore
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";

    export let models: any[] = [];
    export let materials: any[] = [];
    export let renderer: THREE.WebGLRenderer;
    export let camera: THREE.PerspectiveCamera;
    export let enabled: boolean;
    $: enabled, loop();

    const scene = new THREE.Scene();

    onMount(() => init());

    const init = () => {
        gsap.registerPlugin(ScrollTrigger);

        loadScene();

        loop();
    };

    const loadScene = () => {};

    const loop = () => {
        if (!enabled) return;

        requestAnimationFrame(loop);

        renderer.render(scene, camera);
    };
</script>
