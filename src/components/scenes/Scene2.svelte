<script lang="ts">
    import * as THREE from "three";
    import { Vector3 } from "three";
    import { createEventDispatcher, onMount } from "svelte";

    export let models: any[] = [];
    export let renderer: THREE.WebGLRenderer;
    export let enabled: boolean;

    $: enabled, loop();
    $: enabled, tone();
    $: enabled, resize();
    // $: models, meshToParticles();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 10, 3000);
    camera.position.set(300, 60, 300).normalize().multiplyScalar(1000);
    scene.add(camera);
    scene.userData.camera = camera;
    scene.userData.scene = 2;

    const dispatch = createEventDispatcher();

    let mounted = false;
    let pointsMaterial: any;
    let clock = new THREE.Clock();
    let pointLight: any;
    let shadowDarkness = 0.45;

    onMount(async () => await init());

    const init = async () => {
        renderer.compile(scene, camera);

        mounted = true;

        dispatch("mount", { scene });

        loop();
    };

    const tone = () => {
        if (!enabled) return;
    };

    const resize = () => {
        if (!enabled) return;

        renderer.domElement.resize(renderer, camera);
    };

    const loop = () => {
        if (!enabled) return;

        requestAnimationFrame(loop);

        const time = clock.getDelta();
    };
</script>

<svelte:window
    on:resize={() => resize()}
    on:orientationchange={() => resize()}
/>
