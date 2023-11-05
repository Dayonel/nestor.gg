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
        transmission: 0.7,
        thickness: 1,
    });
    const material = new MaterialDTO("Windows", windowMaterial);

    onMount(() => init());

    const init = () => {
        gsap.registerPlugin(ScrollTrigger);

        camera.position.set(0, 7, cameraZ);

        const geometry = new THREE.PlaneGeometry(200, 200);
        const material = new THREE.MeshLambertMaterial({ color: 0xbcbcbc });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, -1, 0);
        mesh.rotation.x = THREE.MathUtils.degToRad(-90);
        mesh.receiveShadow = true;
        scene.add(mesh);

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
        // const ambient = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 0.15);
        // scene.add(ambient);

        const sphere = new THREE.SphereGeometry(0.5, 16, 8);
        const intensity = 50;

        light1 = new THREE.PointLight(0xff0040, intensity);
        light1.add(
            new THREE.Mesh(
                sphere,
                new THREE.MeshBasicMaterial({ color: 0xff0040 })
            )
        );
        scene.add(light1);

        light2 = new THREE.PointLight(0x0040ff, intensity);
        light2.add(
            new THREE.Mesh(
                sphere,
                new THREE.MeshBasicMaterial({ color: 0x0040ff })
            )
        );
        scene.add(light2);

        light3 = new THREE.PointLight(0x80ff80, intensity);
        light3.add(
            new THREE.Mesh(
                sphere,
                new THREE.MeshBasicMaterial({ color: 0x80ff80 })
            )
        );
        scene.add(light3);

        light4 = new THREE.PointLight(0xffaa00, intensity);
        light4.add(
            new THREE.Mesh(
                sphere,
                new THREE.MeshBasicMaterial({ color: 0xffaa00 })
            )
        );
        scene.add(light4);

        spotLight = new THREE.SpotLight(0xffffff, 1000);
        spotLight.position.set(10, 50, 40);
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 1;
        spotLight.decay = 2;
        spotLight.distance = 0;

        spotLight.castShadow = true;
        scene.add(spotLight);

        lightHelper = new THREE.SpotLightHelper(spotLight);
        scene.add(lightHelper);
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
        const near = cameraZ - 5;
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

            lightHelper.update();
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
<!-- <Water {scene} /> -->
