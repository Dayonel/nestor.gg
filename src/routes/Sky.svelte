<script lang="ts">
    import { onMount } from "svelte";
    // @ts-ignore
    import * as THREE from "three";
    // @ts-ignore
    import { GroundProjectedSkybox } from "three/addons/objects/GroundProjectedSkybox.js";

    export let scene: THREE.Scene;
    export let renderer: THREE.WebGLRenderer;
    export let envMap: any;

    onMount(async () => {
        await init();
    });

    const init = async () => {
        const params = {
            height: -100,
            radius: 300,
        };
        envMap.mapping = THREE.EquirectangularRefractionMapping;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;

        const skybox = new GroundProjectedSkybox(envMap);
        skybox.position.z = 50;
        skybox.position.y = -25;
        skybox.scale.setScalar(100);
        scene.add(skybox);

        renderer.outputColorSpace = THREE.SRGBColorSpace;
        skybox.radius = params.radius;
        skybox.height = params.height;
    };
</script>
