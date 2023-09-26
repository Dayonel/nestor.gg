<script lang="ts">
    import { onMount } from "svelte";
    // @ts-ignore
    import * as THREE from "three";
    // @ts-ignore
    import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
    // @ts-ignore
    import { GroundProjectedSkybox } from "three/addons/objects/GroundProjectedSkybox.js";

    export let scene: THREE.Scene;
    export let renderer: THREE.WebGLRenderer;

    onMount(async () => {
        await init();
    });

    const init = async () => {
        const loader = new RGBELoader();
        const params = {
            height: 0,
            radius: 500,
        };
        const envMap = await loader.loadAsync(
            "textures/skybox/kloppenheim_06_puresky_2k.hdr"
        );
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        // renderer.toneMapping = THREE.ACESFilmicToneMapping;
        // renderer.toneMappingExposure = 1;

        const skybox = new GroundProjectedSkybox(envMap);
        skybox.position.z = 50;
        // skybox.position.y = -50;
        skybox.scale.setScalar(100);
        scene.add(skybox);

        renderer.outputColorSpace = THREE.SRGBColorSpace;
        skybox.radius = params.radius;
        skybox.height = params.height;
    };
</script>
