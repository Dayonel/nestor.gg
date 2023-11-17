<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import * as THREE from "three";
    export let models: any[] = [];
    export let textures: any[] = [];
    export let renderer: THREE.WebGLRenderer;
    export let camera: THREE.PerspectiveCamera;
    export let scrollY: number;
    export let enabled: boolean;

    onMount(() => init());
    const dispatch = createEventDispatcher();
    const scene = new THREE.Scene();
    let mounted = false;
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        30000
    );
    scene.add(camera);
    scene.userData.camera = camera;
    scene.userData.scene = 2;

    const init = () => {
        // gsap.registerPlugin(ScrollTrigger);

        mounted = true;

        renderer.compile(scene, camera);

        dispatch("mount", { scene });
    };
</script>
