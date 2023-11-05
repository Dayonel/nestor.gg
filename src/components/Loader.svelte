<script lang="ts" context="module">
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
        "models/amsterdam1.glb",
        "models/amsterdam2.glb",
        "models/amsterdam3.glb",
        "models/amsterdam4.glb",
    ];

    const materials: any[] = [];
    const total = models.length + materials.length;
</script>

<script lang="ts">
    import Loading from "./Loading.svelte";

    const dispatch = createEventDispatcher();
    let models_loaded: any[] = [];
    let materials_loaded: any[] = [];
    let progress = 0;

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
            progress++;
            materials_loaded = [
                ...materials_loaded,
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
</script>

{#await load()}
    <Loading {progress} {total} />
{:catch}
    <p>Failed to load items.</p>
{/await}
