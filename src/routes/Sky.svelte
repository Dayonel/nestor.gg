<script lang="ts">
    import { onMount } from "svelte";
    // @ts-ignore
    import * as THREE from "three";

    export let scene: THREE.Scene;
    export let renderer: THREE.WebGLRenderer;
    export let envMap: any;

    let sky: any;
    onMount(async () => {
        await init();
    });

    const init = async () => {
        lights();
        skybox();
    };

    const lights = () => {
        // sky color ground color intensity
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        hemiLight.position.set(0, 20, -20);
        scene.add(hemiLight);

        const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
        // scene.add(hemiLightHelper);

        const dirLight = new THREE.DirectionalLight(0xffffff, 10);
        dirLight.color.setHSL(0.1, 1, 0.95);
        dirLight.position.set(-1, 1.75, 1);
        dirLight.position.multiplyScalar(30);
        scene.add(dirLight);

        dirLight.castShadow = true;

        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;

        const d = 50;

        dirLight.shadow.camera.left = -d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = -d;

        dirLight.shadow.camera.far = 3500;
        dirLight.shadow.bias = -0.0001;

        const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
        // scene.add(dirLightHelper);
    };

    const skybox = () => {
        envMap.mapping = THREE.EquirectangularRefractionMapping;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    };
</script>
