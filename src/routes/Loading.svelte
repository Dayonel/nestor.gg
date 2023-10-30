<script context="module">
    import { createEventDispatcher } from "svelte";
    import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

    const gltfLoader = new GLTFLoader();
    const draco = new DRACOLoader(); // compression
    draco.setDecoderConfig({ type: "js" });
    draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    gltfLoader.setDRACOLoader(draco);
    const rgbeLoader = new RGBELoader();

    const models = [
        "models/amsterdam1.gltf",
        "models/amsterdam2.gltf",
        "models/amsterdam3.gltf",
        "models/amsterdam4.gltf",
        "models/amsterdam5.gltf",
        "models/amsterdam6.gltf",
    ];
    const materials = ["textures/skybox/venice_sunset_2k.hdr"];
</script>

<script lang="ts">
    const dispatch = createEventDispatcher();
    let models_loaded: any[] = [];
    let materials_loaded: any[] = [];

    const load = async (): Promise<void> => {
        await loadModels();
        await loadMaterials();

        dispatch("load", {
            models: models_loaded,
            materials: materials_loaded,
        });
    };

    const loadMaterials = async (): Promise<void> => {
        for (const material of materials) {
            materials_loaded = [
                ...materials_loaded,
                await rgbeLoader.loadAsync(material),
            ];
        }
    };

    const loadModels = async (): Promise<void> => {
        for (const model of models) {
            models_loaded = [
                ...models_loaded,
                (await gltfLoader.loadAsync(model)).scene,
            ];
        }
    };
</script>

{#await load()}
    <div class="loading">
        <span>Loading...</span>
        <span class="loader bar">
            <span
                class="progress bar"
                style="width: {(models_loaded.length / models.length) * 100}%"
            />
        </span>
    </div>
{:catch}
    <p>Failed to load items.</p>
{/await}

<style>
    .loading {
        position: fixed;
        z-index: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100dvw;
        height: 100dvh;
        gap: 0.5rem;
    }

    .loader {
        background: #393939;
        position: relative;
        width: 150px;
    }

    .progress {
        background-color: white;
        position: absolute;
    }

    .bar {
        height: 2.5rem;
        transition: all 0.25s;
    }
</style>
