<script lang="ts">
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    // @ts-ignore
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
    import * as THREE from "three";
    import { Vector3 } from "three";
    import { createEventDispatcher, onMount } from "svelte";
    import Sphere from "$lib/Sphere.svelte";
    import Fog from "$lib/Fog.svelte";
    import * as CANNON from "cannon-es";
    import Background from "$lib/Background.svelte";
    import DirectionalLight from "$lib/DirectionalLight.svelte";
    import SpotLight from "$lib/SpotLight.svelte";
    import PointLight from "$lib/PointLight.svelte";

    export let models: any[] = [];
    export let renderer: THREE.WebGLRenderer;
    export let enabled: boolean;

    $: enabled, loop();
    $: enabled, tone();
    $: enabled, resize();
    $: enabled, gsapAnimate();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        70,
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
    let clock = new THREE.Clock();
    let uniforms: any;
    let material: any;
    let sphere1: any, sphere2: any;
    let previousTime: number;
    let fillLight: any;

    onMount(async () => await init());

    const init = async () => {
        gsap.registerPlugin(ScrollTrigger);

        setupLighting();

        renderer.compile(scene, camera);

        mounted = true;

        dispatch("mount", { scene });

        loop();
    };

    const loadMaterial = () => {
        uniforms = THREE.UniformsUtils.merge([THREE.UniformsLib["fog"]]);
        uniforms.time = { type: "f", value: 1 };
        uniforms.diffuse = { type: "c", value: new THREE.Color(0x00ccff) };
        uniforms.secondColor = { type: "c", value: new THREE.Color(0xffffff) };
        uniforms.opacity = { type: "f", value: 1.0 };

        // material = new THREE.ShaderMaterial({
        //     uniforms: uniforms,
        //     vertexShader:
        //         document.getElementById("noise-vs")?.textContent ?? "",
        //     fragmentShader:
        //         document.getElementById("noise-fs")?.textContent ?? "",
        //     fog: true,
        // });

        material = new THREE.MeshPhongMaterial({
            emissive: new THREE.Color("#1a1a1a"),
            shininess: 0,
            reflectivity: 1,
        });
    };

    const setupLighting = () => {
        const sunLight = new THREE.DirectionalLight(0x435c72, 0.08);
        sunLight.position.set(-100, 0, -100);
        scene.add(sunLight);

        fillLight = new THREE.PointLight(0xffffff, 0.1, 0, 2);
        const sphereSize = 1;
        const pointLightHelper = new THREE.PointLightHelper(
            fillLight,
            sphereSize,
        );
        scene.add(pointLightHelper);
        fillLight.position.set(0, 0, -5);
        scene.add(fillLight);
    };

    const gsapAnimate = () => {
        if (!enabled) return;

        ScrollTrigger.create({
            scroller: "#scrolling",
            start: "top top",
            end: "+=" + window.innerHeight,
            scrub: true,
            trigger: "#scene2",
            onUpdate: (self: any) => {
                // Update the progress variable during the animation
                progress = 1 - self.progress;
                console.log(progress);
            },
        });
    };

    const tone = () => {
        if (!enabled) return;

        // renderer.toneMapping = THREE.NoToneMapping;
        // renderer.toneMappingExposure = 1;
    };

    const resize = () => {
        if (!enabled) return;

        renderer.domElement.resize(renderer, camera);
    };

    const pointerMove = (e: PointerEvent) => {
        const cursor = { x: 0, y: 0 };
        cursor.x = (e.clientX / window.innerWidth) * 2 - 1;
        cursor.y = -(e.clientY / window.innerHeight) * 2 + 1;

        followMouse(cursor);
    };

    const followMouse = (cursor: { x: number; y: number }) => {
        var vector = new THREE.Vector3(cursor.x, cursor.y, 0);
        vector.unproject(camera);
        var dir = vector.sub(camera.position).normalize();
        var distance = -camera.position.z - 5 / dir.z;
        const lightPos = camera.position
            .clone()
            .add(dir.multiplyScalar(distance));

        fillLight.position.copy(lightPos);
    };

    const loop = () => {
        if (!enabled) return;

        requestAnimationFrame(loop);

        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - previousTime;
        previousTime = elapsedTime;

        const time = clock.getElapsedTime() * 0.01;

        if (mounted) {
            // Copy coordinates from Cannon to Three.js
            // f.position.copy(f.userData.body.position);
            // f.quaternion.copy(f.userData.body.quaternion);

            // sphere1.material.uniforms.time.value = -time;
            sphere1.rotation.x = Math.sin(time * 0.7) * 200;
            sphere1.rotation.y = Math.sin(time * 0.3) * 200;

            // sphere2.material.uniforms.time.value = time;
            sphere2.rotation.x = Math.sin(time * 0.8) * 200;
            sphere2.rotation.y = Math.sin(time * 0.2) * 200;
        }
    };

    loadMaterial();
</script>

<svelte:window
    on:resize={() => resize()}
    on:orientationchange={() => resize()}
    on:pointermove={(e) => pointerMove(e)}
/>

<!-- <Background {scene} color={0x1a1a1a} position={new Vector3(0, 0, -5)} /> -->

<Sphere
    bind:ref={sphere1}
    {scene}
    color={0x1a1a1a}
    secondColor={0xc20707}
    position={new Vector3(-2, 0, -5)}
    scale={1}
    {material}
/>

<Sphere
    bind:ref={sphere2}
    {scene}
    color={0x1a1a1a}
    secondColor={0xc20707}
    position={new Vector3(1, -1, -5)}
    scale={1}
    {material}
/>

<!-- <DirectionalLight
    {scene}
    color={0xfffffff}
    intensity={1}
    position={new Vector3(-1, 1.75, 1)}
    scale={30}
/> -->
<!-- 
<SpotLight
    {scene}
    color={0xffffff}
    intensity={20000}
    position={new Vector3(5, 10, 160)}
/>

<PointLight
    {scene}
    color={0xffffff}
    intensity={1}
    position={new Vector3(0, 0, 10)}
/> -->

<Fog {scene} color={0x1a1a1a} near={5} far={10} />
