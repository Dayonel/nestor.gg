<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { SceneFX } from "$lib/SceneFX";
    // @ts-ignore
    import * as THREE from "three";
    import { AnimationFX } from "$lib/AnimationFX";

    export let canvas: HTMLCanvasElement;
    export let renderer: THREE.WebGLRenderer;
    export let scrollPercent: number;
    export let scrollY: number;
    export let totalHeight: number;

    const start = 7;
    const end = 20;
    let sceneFX: SceneFX;
    let plane1: THREE.Mesh;
    let dispatch = createEventDispatcher();

    onMount(() => {
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
        loadScene();

        dispatch("mount", { sceneFX });
    });

    const loadScene = () => {
        const planeGeometry = new THREE.PlaneGeometry(20, 10);
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.DoubleSide,
        });
        plane1 = new THREE.Mesh(planeGeometry, material);
        plane1.position.set(0, -12, 10);
        sceneFX.scene.add(plane1);
    };

    const defineAnimationScripts = () => {
        const animationScripts = [];
        animationScripts.push({
            start: start,
            end: end,
            func: () => {
                sceneFX.camera.position.y =
                    -(scrollY / totalHeight) * 64 + sceneFX.cameraInitialPos.y;

                plane1.rotation.z = AnimationFX.lerp(
                    0,
                    THREE.MathUtils.degToRad(5),
                    AnimationFX.scalePercent(start, end, scrollPercent)
                );
                plane1.scale.x = AnimationFX.lerp(
                    1,
                    5,
                    AnimationFX.scalePercent(start, end, scrollPercent)
                );
                plane1.position.y = AnimationFX.lerp(
                    plane1.position.y,
                    -5,
                    AnimationFX.scalePercent(start, end, scrollPercent)
                );
            },
        });

        return animationScripts;
    };
</script>
