<script lang="ts">
    import * as THREE from "three";
    import { Vector3 } from "three";
    import { createEventDispatcher, onMount } from "svelte";
    import Simulator from "../moving-curl/Simulator.svelte";
    import Particles from "../moving-curl/Particles.svelte";
    import { Settings } from "../moving-curl/Settings";

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
        lights();

        // renderer.compile(scene, camera); // TODO

        mounted = true;

        dispatch("mount", { scene });

        loop();
    };

    const lights = () => {
        const mesh = new THREE.Object3D();
        mesh.position.set(0, 500, 0);

        var ambient = new THREE.AmbientLight(0x333333);
        mesh.add(ambient);

        pointLight = new THREE.PointLight(0xffffff, 1, 700);
        pointLight.castShadow = true;
        pointLight.shadow.camera.near = 10;
        pointLight.shadow.camera.far = 700;
        pointLight.shadow.bias = 0.1;
        pointLight.shadow.mapSize.width = 4096;
        pointLight.shadow.mapSize.height = 2048;
        mesh.add(pointLight);

        var directionalLight = new THREE.DirectionalLight(0xba8b8b, 0.5);
        directionalLight.position.set(1, 1, 1);
        mesh.add(directionalLight);

        var directionalLight2 = new THREE.DirectionalLight(0x8bbab4, 0.3);
        directionalLight2.position.set(1, 1, -1);
        mesh.add(directionalLight2);

        scene.add(mesh);
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

        pointLight.shadowDarkness = shadowDarkness +=
            (Settings.SHADOW_DARKNESS - shadowDarkness) * 0.1;
    };
</script>

<svelte:window
    on:resize={() => resize()}
    on:orientationchange={() => resize()}
/>

<Particles {renderer} {scene} {camera}></Particles>
