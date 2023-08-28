<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { SceneFX } from "$lib/SceneFX";
    import { AnimationFX } from "$lib/AnimationFX";
    import Water from "./Water.svelte";
    // @ts-ignore
    import * as THREE from "three";
    // @ts-ignore
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
    // @ts-ignore
    import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

    export let canvas: HTMLCanvasElement;
    export let renderer: THREE.WebGLRenderer;
    export let scrollPercent: number;
    export let scrollY: number;
    export let totalHeight: number;

    const start = 0;
    const end = 7;
    let sceneFX: SceneFX;
    let water: any;
    let dispatch = createEventDispatcher();

    onMount(async () => {
        const animationScripts = defineAnimationScripts();
        sceneFX = new SceneFX(
            start,
            end,
            canvas,
            renderer,
            window.innerWidth,
            window.innerHeight,
            animationScripts
        );
        await loadScene();

        dispatch("mount", { sceneFX });
    });

    const loadScene = async () => {
        // amsterdam
        const gltfLoader = new GLTFLoader();
        const amsterdam1 = (
            await gltfLoader.loadAsync("models/amsterdam1.gltf")
        ).scene;
        amsterdam1.position.set(2.5, -0.5, 0);
        amsterdam1.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.castShadow = true;
            }
        });
        sceneFX.scene.add(amsterdam1);

        const model2 = (await gltfLoader.loadAsync("models/amsterdam2.gltf"))
            .scene;
        model2.position.set(-2.5, -0.5, 0);
        model2.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.castShadow = true;
            }
        });
        sceneFX.scene.add(model2);

        const model3 = (await gltfLoader.loadAsync("models/amsterdam3.gltf"))
            .scene;
        model3.position.set(-7.5, -0.5, 0);
        model3.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.castShadow = true;
            }
        });
        sceneFX.scene.add(model3);

        const model4 = (await gltfLoader.loadAsync("models/amsterdam4.gltf"))
            .scene;
        model4.position.set(7.5, -0.5, 0);
        model4.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.castShadow = true;
            }
        });
        sceneFX.scene.add(model4);

        // area lights
        RectAreaLightUniformsLib.init();

        const width = 4;
        const height = 25;
        const intensity = 2;

        const rectLight1 = new THREE.RectAreaLight(
            0xff0000,
            intensity,
            width,
            height
        );
        rectLight1.position.set(-5, 0, 0);
        rectLight1.rotation.set(0, THREE.MathUtils.degToRad(180), 0);
        sceneFX.scene.add(rectLight1);

        const rectLight2 = new THREE.RectAreaLight(
            0x00ff00,
            intensity,
            width,
            height
        );
        rectLight2.position.set(-1, 0, 0);
        rectLight2.rotation.set(0, THREE.MathUtils.degToRad(180), 0);
        sceneFX.scene.add(rectLight2);

        const rectLight3 = new THREE.RectAreaLight(
            0x0000ff,
            intensity,
            width,
            height
        );
        rectLight3.position.set(3, 0, 0);
        rectLight3.rotation.set(0, THREE.MathUtils.degToRad(180), 0);
        sceneFX.scene.add(rectLight3);

        const rectLight4 = new THREE.RectAreaLight(
            0xd77e29,
            intensity,
            width,
            height
        );
        rectLight4.position.set(7, 0, 0);
        rectLight4.rotation.set(0, THREE.MathUtils.degToRad(180), 0);
        sceneFX.scene.add(rectLight4);

        // sky light
        const rectLight5 = new THREE.RectAreaLight(0x0e1215, 100, 100, 8);
        rectLight5.position.set(0, 20, 0);
        rectLight5.rotation.set(
            THREE.MathUtils.degToRad(90),
            THREE.MathUtils.degToRad(180),
            0
        );
        sceneFX.scene.add(rectLight5);
    };

    const defineAnimationScripts = () => {
        const animationScripts = [];
        animationScripts.push({
            start: start,
            end: end,
            func: () => {
                sceneFX.camera.position.y =
                    -(scrollY / totalHeight) * 64 + sceneFX.cameraInitialPos.y;
                sceneFX.camera.position.z = AnimationFX.lerp(
                    sceneFX.cameraInitialPos.z,
                    sceneFX.cameraInitialPos.z + 5,
                    AnimationFX.scalePercent(start, end, scrollPercent)
                );
            },
        });

        return animationScripts;
    };
</script>

{#if sceneFX}
    <Water bind:this={water} scene={sceneFX.scene} />
{/if}
