<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { SceneFX } from "$lib/SceneFX";
    import Water from "./Water.svelte";
    // @ts-ignore
    import * as THREE from "three";
    // @ts-ignore
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
    // @ts-ignore
    import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    // @ts-ignore
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
    import GodRays from "./GodRays.svelte";

    export let canvas: HTMLCanvasElement;
    export let renderer: THREE.WebGLRenderer;

    const start = 0;
    const end = 20;
    let sceneFX: SceneFX;
    let water: any;
    let dispatch = createEventDispatcher();
    let group: THREE.Group;
    let godRays: any;

    onMount(async () => {
        gsap.registerPlugin(ScrollTrigger);

        sceneFX = new SceneFX(
            start,
            end,
            canvas,
            renderer,
            window.innerWidth,
            window.innerHeight
        );

        await loadScene();

        animateOnScroll();

        // const funcs: { func: () => void }[] = [];
        // funcs.push({ func: godRays.loop });

        // sceneFX.render(funcs);

        dispatch("mount", { sceneFX });
    });

    const loadScene = async () => {
        group = new THREE.Group();

        // amsterdam
        const gltfLoader = new GLTFLoader();
        const model1 = (await gltfLoader.loadAsync("models/amsterdam1.gltf"))
            .scene;
        model1.position.set(2.45, -0.5, 0);
        model1.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });

        const model2 = (await gltfLoader.loadAsync("models/amsterdam2.gltf"))
            .scene;
        model2.position.set(-2.5, -0.5, 0);
        model2.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });

        const model3 = (await gltfLoader.loadAsync("models/amsterdam3.gltf"))
            .scene;
        model3.position.set(-7.5, -0.5, 0);
        model3.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });

        const model4 = (await gltfLoader.loadAsync("models/amsterdam4.gltf"))
            .scene;
        model4.position.set(7.4, -0.5, 0);
        model4.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });

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

        const rectLight2 = new THREE.RectAreaLight(
            0x00ff00,
            intensity,
            width,
            height
        );
        rectLight2.position.set(-1, 0, 0);
        rectLight2.rotation.set(0, THREE.MathUtils.degToRad(180), 0);

        const rectLight3 = new THREE.RectAreaLight(
            0x0000ff,
            intensity,
            width,
            height
        );
        rectLight3.position.set(3, 0, 0);
        rectLight3.rotation.set(0, THREE.MathUtils.degToRad(180), 0);

        const rectLight4 = new THREE.RectAreaLight(
            0xd77e29,
            intensity,
            width,
            height
        );
        rectLight4.position.set(7, 0, 0);
        rectLight4.rotation.set(0, THREE.MathUtils.degToRad(180), 0);

        // sky light
        const rectLight5 = new THREE.RectAreaLight(0x0e1215, 100, 100, 8);
        rectLight5.position.set(0, 20, 0);
        rectLight5.rotation.set(
            THREE.MathUtils.degToRad(90),
            THREE.MathUtils.degToRad(180),
            0
        );

        const ambientLight = new THREE.AmbientLight(0xffffff);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(-42.659, 35.419, 3.461);

        group.add(model1);
        group.add(model2);
        group.add(model3);
        group.add(model4);
        // group.add(rectLight1);
        // group.add(rectLight2);
        // group.add(rectLight3);
        // group.add(rectLight4);
        // group.add(rectLight5);
        group.add(ambientLight);
        group.add(directionalLight);

        sceneFX.camera.position.set(0, 8, 25);
        // sceneFX.camera.lookAt(0, 3, 0);

        // let color = new THREE.Color();
        // renderer.getClearColor(color);

        const light = new THREE.HemisphereLight(0xffffff, 0xffaa00, 1);
        group.add(light);

        // spot light
        const spotLight = new THREE.SpotLight(0xffffff, 1, 0, 0.314, 1, 2);
        spotLight.position.set(-19.566, 33.137, -24.737);
        spotLight.shadow.normalBias = 7.22;
        spotLight.castShadow = true;
        //Set up shadow properties for the light
        spotLight.shadow.mapSize.width = 512; // default
        spotLight.shadow.mapSize.height = 512; // default
        spotLight.shadow.camera.near = 0.5; // default
        spotLight.shadow.camera.far = 500; // default
        spotLight.shadow.focus = 1; // default
        // group.add(spotLight);

        sceneFX.scene.add(group);

        // scene background color = fog color
        const color = new THREE.Color("lightblue");
        sceneFX.scene.background = color;
        const near = 25;
        const far = 30;
        sceneFX.scene.fog = new THREE.Fog(color, near, far);
    };

    const animateOnScroll = () => {
        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: ".hero",
                start: "top top",
                end: "+=" + window.innerHeight,
                scrub: true,
            },
        }).to(sceneFX.camera.position, {
            x: sceneFX.camera.position.x,
            y: sceneFX.camera.position.y,
            z: 35,
        });
        // gsap.timeline({
        //     scrollTrigger: {
        //         scroller: "#scrolling",
        //         trigger: ".hero",
        //         start: "top top",
        //         end: "+=" + window.innerHeight,
        //         scrub: true,
        //     },
        // }).to(sceneFX.camera.rotation, {
        //     x: THREE.MathUtils.degToRad(90),
        //     y: sceneFX.camera.rotation.y,
        //     z: sceneFX.camera.rotation.z,
        // });
        // gsap.timeline({
        //     scrollTrigger: {
        //         scroller: "#scrolling",
        //         trigger: ".section2",
        //         start: "bottom -100%",
        //         end: "+=" + window.innerHeight * 5,
        //         scrub: true,
        //     },
        // }).to(sceneFX.scene.fog, { density: 0.3 });
    };
</script>

{#if sceneFX}
    <!-- <Water bind:this={water} scene={sceneFX.scene} /> -->
    <!-- <GodRays
        bind:this={godRays}
        camera={sceneFX.camera}
        {renderer}
        scene={sceneFX.scene}
    /> -->
{/if}
