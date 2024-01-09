<script lang="ts">
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    // @ts-ignore
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
    import * as THREE from "three";
    import { Vector3 } from "three";
    import { createEventDispatcher, onMount } from "svelte";

    export let models: any[] = [];
    export let renderer: THREE.WebGLRenderer;
    export let enabled: boolean;

    $: enabled, loop();
    $: enabled, tone();
    $: enabled, resize();
    $: enabled, gsapAnimate();
    $: models, loadModel();

    const fovLandscape = 80;
    const fovPortrait = 105;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        fovLandscape,
        window.innerWidth / window.innerHeight,
        0.001,
        1000,
    );
    camera.position.set(0, 0, 1);
    scene.add(camera);
    scene.userData.camera = camera;
    scene.userData.scene = 2;

    const dispatch = createEventDispatcher();

    let mounted = false;
    let progress = 1;
    let mesh: any;
    let material: any;
    let time = 0;
    let pointSize = 1;
    let objectLoaded = false;

    onMount(async () => await init());

    const init = async () => {
        gsap.registerPlugin(ScrollTrigger);

        renderer.compile(scene, camera);

        mounted = true;

        dispatch("mount", { scene });

        loop();
    };

    const loadModel = () => {
        if (!models || models.length < 5) return;
        if (objectLoaded) return;

        const model = models[4];

        material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: true,
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { value: 1.0 },
                progress: { value: 0.0 },
                pointSize: { value: 2 },
            },
            transparent: true,
            vertexShader:
                document.getElementById("morph-vs")?.textContent ?? "",
            fragmentShader:
                document.getElementById("morph-fs")?.textContent ?? "",
            depthTest: false,
            depthWrite: false,
        });

        model.traverse((obj: any) => {
            if (obj.isMesh) {
                mesh = new THREE.Points(obj.geometry, material);
                mesh.position.set(0, -0.3, 0);
                scene.add(mesh);
            }
        });

        objectLoaded = true;
    };

    const gsapAnimate = () => {
        if (!enabled) return;

        ScrollTrigger.create({
            scroller: "#scrolling",
            start: "top top",
            end: "+=" + window.innerHeight * 0.9,
            scrub: true,
            trigger: "#scene2",
            onUpdate: (self: any) => {
                // Update the progress variable during the animation
                progress = 1 - self.progress;
            },
        });
    };

    const tone = () => {
        if (!enabled) return;
    };

    const resize = () => {
        if (!enabled) return;

        if (window.innerHeight > window.innerWidth) {
            camera.fov = fovPortrait;
            pointSize = 2 + window.devicePixelRatio / 2;
        } else {
            camera.fov = fovLandscape;
            pointSize = 2;
        }

        renderer.domElement.resize(renderer, camera);
    };

    const loop = () => {
        if (!enabled) return;

        requestAnimationFrame(loop);

        time += 0.0001;

        material.uniforms.time.value = time;
        material.uniforms.progress.value = progress;
        material.uniforms.pointSize.value = pointSize;

        if (mesh) {
            if (window.innerHeight > window.innerWidth) {
                mesh.rotation.y = time * 10 * window.devicePixelRatio;
            } else {
                mesh.rotation.y = time * 3;
            }
        }
    };
</script>

<svelte:window
    on:resize={() => resize()}
    on:orientationchange={() => resize()}
/>
