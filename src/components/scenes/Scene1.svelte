<script lang="ts">
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    // @ts-ignore
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
    import * as THREE from "three";
    import GLTF from "$lib/GLTF.svelte";
    import { onMount } from "svelte";
    import Water from "../Water.svelte";
    import { Vector3 } from "three";
    import TWEEN from "@tweenjs/tween.js";
    import { MaterialDTO } from "../../core/dto/MaterialDTO";

    export let models: any[] = [];
    export let materials: any[] = [];
    export let renderer: THREE.WebGLRenderer;
    export let camera: THREE.PerspectiveCamera;
    export let enabled: boolean;
    $: enabled, loop();

    const cameraZ = 25;
    const scene = new THREE.Scene();
    let light1: any,
        light2: any,
        light3: any,
        light4: any,
        spotLight: any,
        lightHelper: any;
    let mounted = false;
    const windowMaterial = new THREE.MeshPhysicalMaterial({
        roughness: 0.7,
        // transmission: 0.7,
        thickness: 1,
        color: 0xcecece,
    });
    const material = new MaterialDTO("Windows", windowMaterial);

    onMount(() => init());

    const init = () => {
        gsap.registerPlugin(ScrollTrigger);

        camera.position.set(0, 7, cameraZ);

        const geometry = new THREE.PlaneGeometry(200, 200);
        const material = new THREE.MeshLambertMaterial({ color: 0xbcbcbc });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        mesh.rotation.x = THREE.MathUtils.degToRad(-90);
        mesh.receiveShadow = true;
        // scene.add(mesh);

        scene.add(camera);

        lights();

        animateOnScroll();

        introAnimation();

        mounted = true;

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
        const intensity = 50;

        light1 = new THREE.PointLight(0xff0040, intensity);
        scene.add(light1);

        light2 = new THREE.PointLight(0x0040ff, intensity);
        scene.add(light2);

        light3 = new THREE.PointLight(0x80ff80, intensity);
        scene.add(light3);

        light4 = new THREE.PointLight(0xffaa00, intensity);
        scene.add(light4);

        // static
        const pointLightIntensity = 30;
        const z = 10;
        const distance = 0;
        const decay = 2;
        const light5 = new THREE.PointLight(
            0xff0000,
            pointLightIntensity,
            distance,
            decay
        );
        light5.position.set(-10, 10, z);
        scene.add(light5);

        const light6 = new THREE.PointLight(
            0x0000ff,
            pointLightIntensity,
            distance,
            decay
        );
        light6.position.set(0, 10, z);
        scene.add(light6);

        const light7 = new THREE.PointLight(
            0xff0000,
            pointLightIntensity,
            distance,
            decay
        );
        light7.position.set(10, 10, z);
        scene.add(light7);

        spotLight = new THREE.SpotLight(0xffffff, 1000);
        spotLight.position.set(10, 50, 40);
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 1;
        spotLight.decay = 2;
        spotLight.distance = 0;

        spotLight.castShadow = true;
        scene.add(spotLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.2);
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
        const color = new THREE.Color("black");
        scene.background = color;
        const near = cameraZ - 10;
        const far = cameraZ;
        scene.fog = new THREE.Fog(color, near, far);
    };

    const loop = () => {
        if (!enabled) return;

        requestAnimationFrame(loop);

        TWEEN.update();

        if (mounted) {
            const z = 40;
            const time = Date.now() * 0.0005;
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

            spotLight.position.x = Math.cos(time) * 2.5;
            spotLight.position.z = Math.sin(time) * 2.5;
        }

        renderer.render(scene, camera);
    };
</script>

<GLTF
    gltf={models[0]}
    {scene}
    position={new Vector3(2.45, -0.25, 0)}
    {material}
/>
<GLTF
    gltf={models[1]}
    {scene}
    position={new Vector3(-2.5, -0.25, 0)}
    {material}
/>
<GLTF
    gltf={models[2]}
    {scene}
    position={new Vector3(-7.5, -0.25, 0)}
    {material}
/>
<GLTF
    gltf={models[3]}
    {scene}
    position={new Vector3(7.4, -0.25, 0)}
    {material}
/>
<Water {scene} />
