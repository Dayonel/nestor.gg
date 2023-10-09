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
    // @ts-ignore
    import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
    // @ts-ignore
    import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
    // @ts-ignore
    import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

    import GodRays from "./GodRays.svelte";
    import Sky from "./Sky.svelte";
    import Cloud from "./Cloud.svelte";

    export let canvas: HTMLCanvasElement;
    export let renderer: THREE.WebGLRenderer;
    export let cameraY = 8;
    export let cameraZ = 40;

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
            window.innerHeight,
            30000
        );

        sceneFX.camera.position.set(0, cameraY, cameraZ);

        await loadScene();

        animateOnScroll();

        // const funcs: { func: () => void }[] = [];
        // funcs.push({ func: godRays.loop });

        // sceneFX.render(funcs);

        dispatch("mount", { sceneFX });
    });

    const loadScene = async () => {
        group = new THREE.Group();

        const textureLoader = new THREE.TextureLoader();

        // const envMap = textureLoader.load(
        //     "textures/skybox/2294472375_24a3b8ef46_o.jpg"
        // );

        const cubeLoader = new THREE.CubeTextureLoader();

        // const envMap = cubeLoader.load([
        //     "textures/skybox/posx.jpg",
        //     "textures/skybox/negx.jpg",
        //     "textures/skybox/posy.jpg",
        //     "textures/skybox/negy.jpg",
        //     "textures/skybox/posz.jpg",
        //     "textures/skybox/negz.jpg",
        // ]);

        const loader = new RGBELoader();
        const envMap = await loader.loadAsync(
            "textures/skybox/kloppenheim_06_puresky_2k.hdr"
        );
        envMap.mapping = THREE.EquirectangularReflectionMapping;

        // amsterdam
        const gltfLoader = new GLTFLoader();
        const draco = new DRACOLoader(); // compression
        draco.setDecoderConfig({ type: "js" });
        draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
        gltfLoader.setDRACOLoader(draco);

        // const windowMaterial = new THREE.MeshBasicMaterial({
        //     // side: THREE.DoubleSide,
        //     // color: 0x767e82,
        //     // envMap: envMap,
        //     refractionRatio: 0.5,
        // });

        const windowMaterial = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            color: 0x0e0f12,
            envMap: envMap,
            refractionRatio: 0.98,
        });

        const model1 = (await gltfLoader.loadAsync("models/amsterdam6.gltf"))
            .scene;
        model1.position.set(3.1, -1.5, 0);
        model1.scale.multiplyScalar(1.5);
        model1.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;

                if (obj.name == "Windows") {
                    obj.material = windowMaterial;
                }
            }
        });

        const model2 = (await gltfLoader.loadAsync("models/amsterdam2.gltf"))
            .scene;
        model2.position.set(-4.4, -1.0, 0);
        model2.scale.multiplyScalar(1.5);
        model2.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;

                if (obj.name == "Windows") {
                    obj.material = windowMaterial;
                }
            }
        });

        const model3 = (await gltfLoader.loadAsync("models/amsterdam3.gltf"))
            .scene;
        model3.position.set(-11.9, -1.5, 0);
        model3.scale.multiplyScalar(1.5);
        model3.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;

                if (obj.name == "Windows") {
                    obj.material = windowMaterial;
                }
            }
        });

        const model4 = (await gltfLoader.loadAsync("models/amsterdam4.gltf"))
            .scene;
        model4.position.set(10.6, -1.5, 0);
        model4.scale.multiplyScalar(1.5);
        model4.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;

                if (obj.name == "Windows") {
                    obj.material = windowMaterial;
                }
            }
        });

        const model5 = (await gltfLoader.loadAsync("models/amsterdam5.gltf"))
            .scene;
        model5.position.set(-19.3, -1.0, 0);
        model5.scale.multiplyScalar(1.5);
        model5.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;

                if (obj.name == "Windows") {
                    obj.material = windowMaterial;
                }
            }
        });

        const model6 = (await gltfLoader.loadAsync("models/amsterdam1.gltf"))
            .scene;
        model6.position.set(18.2, -1.0, 0);
        model6.scale.multiplyScalar(1.5);
        model6.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;

                if (obj.name == "Windows") {
                    obj.material = windowMaterial;
                }
            }
        });

        // const bridge = (await gltfLoader.loadAsync("models/bridge.glb")).scene;
        // bridge.position.z = -50;
        // bridge.scale.multiplyScalar(100);

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

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(-0.317, 37.285, 45.0);
        directionalLight.target.position.set(0, 0, 0);

        group.add(model1);
        group.add(model2);
        group.add(model3);
        group.add(model4);
        group.add(model5);
        group.add(model6);
        // group.add(bridge);
        // group.add(rectLight1);
        // group.add(rectLight2);
        // group.add(rectLight3);
        // group.add(rectLight4);
        // group.add(rectLight5);
        // group.add(directionalLight);
        // group.add(directionalLight.target);

        // sceneFX.camera.lookAt(0, 3, 0);

        // let color = new THREE.Color();
        // renderer.getClearColor(color);

        // spot light
        const spotLight = new THREE.SpotLight(0xffffff, 2000, 0, 0.314, 1, 2);
        spotLight.position.set(-30.254, 63.726, -24.101);
        // spotLight.shadow.normalBias = 7.22;
        spotLight.castShadow = true;
        //Set up shadow properties for the light
        spotLight.shadow.mapSize.width = 512; // default
        spotLight.shadow.mapSize.height = 512; // default
        spotLight.shadow.camera.near = 0.5; // default
        spotLight.shadow.camera.far = 500; // default
        spotLight.shadow.focus = 1; // default
        // sceneFX.scene.add(spotLight);

        sceneFX.scene.add(group);
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
            z: cameraZ,
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

        // scene background color = fog color
        // const color = new THREE.Color("black");
        // sceneFX.scene.background = color;
        // const near = 35;
        // const far = cameraZ;
        // sceneFX.scene.fog = new THREE.Fog(color, near, far);
    };
</script>

{#if sceneFX}
    <Sky scene={sceneFX.scene} {renderer} {cameraY} {cameraZ} />
    <Water bind:this={water} scene={sceneFX.scene} />
    <!-- <Cloud {renderer} scene={sceneFX.scene} on:mount /> -->

    <!-- <GodRays
        bind:this={godRays}
        camera={sceneFX.camera}
        {renderer}
        scene={sceneFX.scene}
    /> -->
{/if}
