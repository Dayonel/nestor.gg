<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { SceneFX } from "$lib/SceneFX";
    import * as THREE from "three";
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    // @ts-ignore
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";

    export let canvas: HTMLCanvasElement;
    export let renderer: THREE.WebGLRenderer;

    const start = 10;
    const end = 30;
    let sceneFX: SceneFX;
    let plane1: THREE.Mesh;
    let dispatch = createEventDispatcher();

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        sceneFX = new SceneFX(
            start,
            end,
            canvas,
            renderer,
            window.innerWidth,
            window.innerHeight,
            200
        );

        loadScene();

        animateOnScroll();

        dispatch("mount", { sceneFX });
    });

    const loadScene = () => {
        const planeGeometry = new THREE.PlaneGeometry(20, 10);
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.DoubleSide,
        });
        plane1 = new THREE.Mesh(planeGeometry, material);
        plane1.position.set(0, -12, 10);
        sceneFX.scene.add(plane1);
    };

    const animateOnScroll = () => {
        // camera
        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: ".hero",
                start: "top bottom",
                end: "+=" + window.innerHeight,
                scrub: true,
            },
        })
            .to(sceneFX.camera.position, {
                x: sceneFX.camera.position.x,
                y: -5,
                z: sceneFX.camera.position.z,
            })
            .to(plane1.rotation, {
                x: plane1.rotation.x,
                y: THREE.MathUtils.degToRad(5),
                z: plane1.rotation.z,
            })
            .to(plane1.scale, {
                x: 5,
                y: plane1.scale.y,
                z: plane1.scale.z,
            })
            .to(plane1.position, {
                x: plane1.position.x,
                y: -5,
                z: plane1.position.z,
            });
    };
</script>
