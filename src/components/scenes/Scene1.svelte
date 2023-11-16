<script lang="ts">
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    // @ts-ignore
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
    import * as THREE from "three";
    import GLTF from "$lib/GLTF.svelte";
    import { createEventDispatcher, onMount } from "svelte";
    import Water from "../Water.svelte";
    import { Vector3 } from "three";
    import TWEEN from "@tweenjs/tween.js";
    import { MaterialDTO } from "../../core/dto/MaterialDTO";
    import PointLight from "$lib/PointLight.svelte";
    import SpotLight from "$lib/SpotLight.svelte";
    import DirectionalLight from "$lib/DirectionalLight.svelte";
    import Fog from "$lib/Fog.svelte";
    import Background from "$lib/Background.svelte";

    export let models: any[] = [];
    export let renderer: THREE.WebGLRenderer;
    export let camera: THREE.PerspectiveCamera;
    export let scrollY: number;
    export let enabled: boolean;
    $: enabled, loop();
    $: enabled, resize();
    $: enabled, tone();

    const dispatch = createEventDispatcher();
    const scene = new THREE.Scene();
    scene.userData.camera = camera;

    const cameraZ = 25;
    const tweenToZ = cameraZ - 10;
    let light1: any, light2: any, light3: any, light4: any;
    let mounted = false;

    let materials: MaterialDTO[] = [];
    materials.push(
        new MaterialDTO(
            new THREE.MeshPhysicalMaterial({
                roughness: 0.7,
                thickness: 1,
                color: 0xcecece,
            }),
            "Windows"
        )
    );

    materials.push(
        new MaterialDTO(
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 1,
                roughness: 0.6,
                side: THREE.DoubleSide,
            })
        )
    );

    let group = new THREE.Group();
    scene.add(group);

    let introFinished = false;
    let introTime = 1000;
    let introTween: any;
    let scrollTween: any;

    const fovLandscape = 70;
    const fovPortrait = 105;

    onMount(() => init());

    const init = () => {
        gsap.registerPlugin(ScrollTrigger);

        camera.position.set(0, 7, cameraZ);

        animateOnScroll();

        introAnimation();

        mounted = true;

        renderer.compile(scene, camera);

        dispatch("mount", { scene });
        console.log("scene1 has mounted");
    };

    const introAnimation = () => {
        introTween = new TWEEN.Tween(camera.position)
            .to(
                {
                    x: camera.position.x,
                    y: camera.position.y,
                    z: tweenToZ,
                },
                introTime // time take to animate
            )
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => (introFinished = true))
            .start();
    };

    const animateOnScroll = () => {
        scrollTween = gsap
            .timeline({
                scrollTrigger: {
                    scroller: "#scrolling",
                    trigger: ".gsap-hero",
                    start: "top top",
                    end: "+=" + window.innerHeight,
                    scrub: true,
                },
            })
            .to(camera.position, {
                x: camera.position.x,
                y: camera.position.y,
                z: cameraZ,
            });
    };

    const resize = () => {
        if (!enabled) return;

        if (window.innerHeight > window.innerWidth) {
            camera.fov = fovPortrait;
        } else {
            camera.fov = fovLandscape;
        }

        renderer.domElement.resize(renderer, camera);
    };

    const tone = () => {
        if (!enabled) return;

        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 2;
    };

    const loop = () => {
        if (!enabled) return;

        const now = Date.now();

        requestAnimationFrame(loop);

        if (!introFinished) {
            if (scrollY == 0) {
                // regular update
                TWEEN.update();
            } else if (!introFinished) {
                // force update
                scrollTween.totalProgress(1).kill(); // kill
                introTween.update(now + introTime); // kill
                animateOnScroll(); // do this as usual
            }
        }

        if (mounted) {
            const z = 40;
            const time = now * 0.0005;
            light1.position.x = Math.sin(time * 0.7) * 30;
            light1.position.y = Math.cos(time * 0.5) * 40;
            light1.position.z = Math.cos(time * 0.3) * z;

            light2.position.x = Math.cos(time * 0.3) * 30;
            light2.position.y = Math.sin(time * 0.5) * 40;
            light2.position.z = Math.sin(time * 0.7) * z;

            light3.position.x = Math.sin(time * 0.7) * 30;
            light3.position.y = Math.cos(time * 0.3) * 40;
            light3.position.z = Math.sin(time * 0.5) * z;

            light4.position.x = Math.sin(time * 0.3) * 30;
            light4.position.y = Math.cos(time * 0.7) * 40;
            light4.position.z = Math.sin(time * 0.5) * z;
        }

        // first section is 100dvh = window.innerHeight
        group.rotation.y =
            THREE.MathUtils.degToRad(scrollY / window.innerHeight) * 180;
    };
</script>

<svelte:window
    on:resize={() => resize()}
    on:orientationchange={() => resize()}
/>

<Background {scene} color={0xc22fca} position={new Vector3(0, 0, -5)} />

<GLTF
    gltf={models[0]}
    {scene}
    position={new Vector3(2.45, -0.5, 0)}
    {materials}
    {group}
/>
<GLTF
    gltf={models[1]}
    {scene}
    position={new Vector3(-2.5, -0.5, 0)}
    {materials}
    {group}
/>
<GLTF
    gltf={models[2]}
    {scene}
    position={new Vector3(-7.5, -0.5, 0)}
    {materials}
    {group}
/>
<GLTF
    gltf={models[3]}
    {scene}
    position={new Vector3(7, -0.5, 0)}
    {materials}
    {group}
/>
<!-- <Water {scene} /> -->

<!-- Moving lights -->
<PointLight bind:ref={light1} {scene} color={0xff0040} intensity={50} />
<PointLight bind:ref={light2} {scene} color={0x0040ff} intensity={50} />
<PointLight bind:ref={light3} {scene} color={0x80ff80} intensity={50} />
<PointLight bind:ref={light4} {scene} color={0xffaa00} intensity={50} />

<!-- Static lights -->
<PointLight
    {scene}
    color={0xff0000}
    intensity={50}
    position={new Vector3(-10, 10, 10)}
/>

<PointLight
    {scene}
    color={0x0000ff}
    intensity={50}
    position={new Vector3(0, 10, 10)}
/>

<PointLight
    {scene}
    color={0xff0000}
    intensity={50}
    position={new Vector3(10, 10, 10)}
/>

<SpotLight
    {scene}
    color={0xffffff}
    intensity={2000}
    position={new Vector3(0, 50, -1)}
/>

<DirectionalLight
    {scene}
    color={0xf2f2f2}
    intensity={0.12}
    position={new Vector3(-1, 1.75, 1)}
    scale={30}
/>

<Fog {scene} color={0x000000} near={cameraZ - 5} far={cameraZ} />
