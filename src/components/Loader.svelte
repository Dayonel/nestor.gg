<script lang="ts" context="module">
    import { createEventDispatcher, tick } from "svelte";
    import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
    import * as THREE from "three";
    import Three from "../components/Three.svelte";

    const gltfLoader = new GLTFLoader();
    const draco = new DRACOLoader(); // compression
    draco.setDecoderConfig({ type: "js" });
    draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    gltfLoader.setDRACOLoader(draco);
    const rgbeLoader = new RGBELoader();
    const textureLoader = new THREE.TextureLoader();

    const models = [
        "models/amsterdam1.glb",
        "models/amsterdam2.glb",
        "models/amsterdam3.glb",
        "models/amsterdam4.glb",
    ];

    const time: number = 1;
    const timeMs = time * 1000;
    const hdris: any[] = ["hdris/empty_warehouse_01_1k.hdr"];
    const textures: any[] = ["textures/melina.jpg", "logos/svelte_logo.png"];

    const updates = 2;
    const breakpoint = ((timeMs * 1) / updates) * 0.9;
    const intervalDuration = timeMs / updates;
    const total = models.length + hdris.length + textures.length + updates;
</script>

<script lang="ts">
    import Loading from "./Loading.svelte";

    export let scrollPercent: number = 0;
    export let scrollY: number = 0;
    export let scene: number = 1;

    const dispatch = createEventDispatcher();
    let models_loaded: any[] = [];
    let hdris_loaded: any[] = [];
    let textures_loaded: any[] = [];
    let progress = 0;
    let renderer: THREE.WebGLRenderer;
    let scenes: any[] = [];
    let preRendered: boolean = false;
    let elapsed = 0;

    const load = async (): Promise<void> => {
        await loadModels();
        await loadHdris();
        await loadTextures();
        await preRender();

        dispatch("load");
    };

    const loadHdris = async (): Promise<void> => {
        for (const material of hdris) {
            progress++;
            hdris_loaded = [
                ...hdris_loaded,
                await rgbeLoader.loadAsync(material),
            ];
        }
    };

    const loadModels = async (): Promise<void> => {
        for (const model of models) {
            progress++;
            models_loaded = [
                ...models_loaded,
                (await gltfLoader.loadAsync(model)).scene,
            ];
        }
    };

    const loadTextures = async (): Promise<void> => {
        for (const model of textures) {
            progress++;
            textures_loaded = [
                ...textures_loaded,
                await textureLoader.loadAsync(model),
            ];
        }
    };

    const preRender = (): Promise<void> => {
        return new Promise((resolve) => {
            const startTime = performance.now();

            function checkTime(currentTime: number) {
                elapsed = currentTime - startTime;
                if (elapsed >= timeMs) {
                    preRendered = true;
                    resolve();
                } else {
                    scenes.forEach((f) => {
                        renderer.render(f, f.userData.camera);
                        renderer.clear();
                    });

                    const count = progress - total + updates;

                    if (
                        elapsed >= breakpoint &&
                        count < updates &&
                        elapsed - breakpoint >= count * intervalDuration
                    ) {
                        progress++;
                    }

                    requestAnimationFrame(checkTime);
                }
            }

            requestAnimationFrame(checkTime);
        });
    };
</script>

<Three
    bind:renderer
    bind:scenes
    {scrollPercent}
    {scrollY}
    models={models_loaded}
    hdris={hdris_loaded}
    textures={textures_loaded}
    {scene}
    {preRendered}
/>

{#await load()}
    <Loading {progress} {total} />
{:catch}
    <p class="fail">Failed to load items.</p>
{/await}

<style>
    .fail {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }
</style>
