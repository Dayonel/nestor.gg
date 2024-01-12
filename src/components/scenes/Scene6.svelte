<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import * as THREE from "three";

    export let renderer: THREE.WebGLRenderer;
    export let enabled: boolean;
    $: enabled, loop();
    $: enabled, resize();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        0.1,
        30000,
    );
    camera.position.set(0, 0, 20);
    scene.add(camera);
    scene.userData.camera = camera;
    scene.userData.scene = 6;

    const dispatch = createEventDispatcher();
    let mounted = false;
    var uniforms: any;
    var clock = new THREE.Clock();

    onMount(() => init());

    const init = () => {
        var planeGeom = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector2(1, 1),
            new THREE.Vector2(-1, 1),
            new THREE.Vector2(0, -1),
        ]);
        planeGeom.setAttribute(
            "uv",
            new THREE.Float32BufferAttribute([0, 1, 0.5, 0, 1, 1], 2),
        );

        uniforms = {
            time: { type: "f", value: 1 },
            diffuse: { type: "c", value: new THREE.Color(0x00ccff) },
            opacity: { type: "f", value: 1.0 },
        };

        var planeMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader:
                document.getElementById("noise-vs")?.textContent ?? "",
            fragmentShader:
                document.getElementById("noise-fs")?.textContent ?? "",
        });

        var plane = new THREE.Mesh(planeGeom, planeMat);
        plane.scale.setScalar(4);
        scene.add(plane);

        mounted = true;

        dispatch("mount", { scene });
    };

    const resize = () => {
        if (!enabled) return;

        renderer.domElement.resize(renderer, camera);
    };

    const loop = () => {
        if (!enabled) return;

        requestAnimationFrame(loop);

        uniforms.time.value = clock.getElapsedTime() * 0.125;
    };
</script>

<svelte:window
    on:resize={() => resize()}
    on:orientationchange={() => resize()}
/>
