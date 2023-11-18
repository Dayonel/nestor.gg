<script lang="ts" context="module">
    import { createEventDispatcher } from "svelte";
    import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
    import * as THREE from "three";

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

    const hdris: any[] = [];
    const textures: any[] = ["textures/melina.jpg"];
    const total = models.length + hdris.length + textures.length;
</script>

<script lang="ts">
    import Loading from "./Loading.svelte";

    const dispatch = createEventDispatcher();
    let models_loaded: any[] = [];
    let hdris_loaded: any[] = [];
    let textures_loaded: any[] = [];
    let progress = 0;

    const load = async (): Promise<void> => {
        await loadModels();
        await loadHdris();
        await loadTextures();
        dispatch("load", {
            models: models_loaded,
            hdris: hdris_loaded,
            textures: textures_loaded,
        });
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
</script>

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
