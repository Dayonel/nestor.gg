<script lang="ts">
    import { Figure } from "$lib/GodRays/Figure";
    import { LightSource } from "$lib/GodRays/LightSource";
    import {
        EffectComposer,
        EffectPass,
        GodRaysEffect,
        RenderPass,
    } from "postprocessing";
    import * as THREE from "three";
    import { onMount } from "svelte";

    export let scene: THREE.Scene;
    export let renderer: THREE.WebGLRenderer;
    export let camera: THREE.PerspectiveCamera;

    let light: LightSource;
    let clock: THREE.Clock;
    let composer: EffectComposer;
    let figure1: Figure;
    // let figure2: Figure;
    // let figure3: Figure;

    onMount(() => {
        light = new LightSource();
        light.position.set(2, 0, -10);
        scene.add(light);

        const geo = new THREE.PlaneGeometry(100, 100);
        const mat = new THREE.MeshBasicMaterial({ color: 0x080808 });
        const plane = new THREE.Mesh(geo, mat);
        // scene.add(plane);

        figure1 = new Figure();
        scene.add(figure1);

        // figure2 = new Figure();
        // figure2.position.x -= 20;
        // scene.add(figure2);

        // figure3 = new Figure();
        // figure3.position.x = 20;
        // scene.add(figure3);

        composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        let gre = new GodRaysEffect(camera, light, {
            height: 480,
            kernelSize: 2,
            density: 1,
            decay: 0.9,
            weight: 0.5,
            exposure: 0.3,
            samples: 20,
            clampMax: 0.95,
        });
        composer.addPass(new EffectPass(camera, gre));

        clock = new THREE.Clock();
        loop();
    });

    const loop = () => {
        requestAnimationFrame(loop);

        let t = clock.getElapsedTime();

        light.userData.time.value = t;
        light.position.x = Math.cos(t) * 4;
        light.position.y = Math.sin(t * 0.6) * 4;
        const y = camera.fov > 70 ? 30 : 20;

        figure1.position.y = y;
        // figure2.position.y = y;
        // figure3.position.y = y;
        light.position.y = Math.sin(t * 0.6) * 4 + y / 2;

        composer.render();
    };
</script>
