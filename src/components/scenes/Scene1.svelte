<script lang="ts">
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    // @ts-ignore
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
    import * as THREE from "three";
    import GLTF from "$lib/GLTF.svelte";
    import { afterUpdate, onMount } from "svelte";
    import { MaterialDTO } from "../../core/dto/MaterialDTO";
    import Water from "../Water.svelte";
    import { Vector3 } from "three";
    import TWEEN from "@tweenjs/tween.js";

    export let models: any[] = [];
    export let materials: any[] = [];
    export let renderer: THREE.WebGLRenderer;
    export let camera: THREE.PerspectiveCamera;
    export let enabled: boolean;
    $: enabled, loop();

    const cameraZ = 40;
    const scene = new THREE.Scene();
    const envMap = materials[0];
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    const windowMaterial = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: 0x2a2823,
        envMap: envMap,
        reflectivity: 1,
        refractionRatio: 0.98,
        shininess: 100,
    });

    onMount(() => init());

    const material = new MaterialDTO("Windows", windowMaterial);

    const init = () => {
        gsap.registerPlugin(ScrollTrigger);

        camera.position.set(0, 8, cameraZ);

        scene.add(camera);

        lights();

        animateOnScroll();

        introAnimation();

        loop();

        console.log("scene1 has mounted");
    };

    const introAnimation = () => {
        // @ts-ignore
        new TWEEN.Tween(camera.position)
            .to(
                {
                    // @ts-ignore
                    x: camera.position.x,
                    // @ts-ignore
                    y: camera.position.y,
                    z: cameraZ - 10,
                },
                1000 // 2500
            ) // time take to animate
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
    };

    const lights = () => {
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        hemiLight.position.set(0, 20, -20);
        scene.add(hemiLight);

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
        }).to(camera.position, {
            x: camera.position.x,
            y: camera.position.y,
            z: cameraZ,
        });

        // scene background color = fog color
        // const color = new THREE.Color("black");
        // sceneFX.scene.background = color;
        // const near = 35;
        // const far = cameraZ;
        // sceneFX.scene.fog = new THREE.Fog(color, near, far);
    };

    const loop = () => {
        if (!enabled) return;

        requestAnimationFrame(loop);

        TWEEN.update();

        renderer.render(scene, camera);
    };
</script>

<GLTF
    gltf={models[5]}
    {scene}
    position={new Vector3(3.5, -1.5, 0)}
    {material}
/>
<GLTF
    gltf={models[1]}
    {scene}
    position={new Vector3(-4.0, -1.0, 0)}
    {material}
/>
<GLTF
    gltf={models[2]}
    {scene}
    position={new Vector3(-11.5, -1.5, 0)}
    {material}
/>
<GLTF gltf={models[3]} {scene} position={new Vector3(11, -1.5, 0)} {material} />
<GLTF
    gltf={models[4]}
    {scene}
    position={new Vector3(-18.9, -1.0, 0)}
    {material}
/>
<GLTF
    gltf={models[0]}
    {scene}
    position={new Vector3(18.6, -1.0, 0)}
    {material}
/>
<Water {scene} />
