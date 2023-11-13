<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { Vector3 } from "three";
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    // @ts-ignore
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
    import Fog from "$lib/Fog.svelte";
    import DirectionalLight from "$lib/DirectionalLight.svelte";
    import type { SphereDTO } from "../../core/dto/SphereDTO";

    export let renderer: THREE.WebGLRenderer;
    export let camera: THREE.PerspectiveCamera;
    export let scrollY: number;
    export let enabled: boolean;
    $: enabled, loop();
    $: enabled, resize();
    $: enabled, tone();
    $: scrollY, scroll();

    const scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        30000
    );
    camera.position.set(0, 0, 15);
    let mounted = false;
    var clock = new THREE.Clock();
    let uniforms = THREE.UniformsUtils.merge([THREE.UniformsLib["fog"]]);
    uniforms.time = { type: "f", value: 1 };
    uniforms.diffuse = { type: "c", value: new THREE.Color(0x00ccff) };
    uniforms.secondColor = { type: "c", value: new THREE.Color(0xffffff) };
    uniforms.opacity = { type: "f", value: 1.0 };

    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById("noise-vs")?.textContent ?? "",
        fragmentShader: document.getElementById("noise-fs")?.textContent ?? "",
        fog: true,
    });

    const group = new THREE.Group();
    const map = new Map();

    onMount(() => init());

    const init = () => {
        gsap.registerPlugin(ScrollTrigger);

        setupSpheres();

        scene.add(group);

        mounted = true;
    };

    const resize = () => {
        if (!enabled) return;

        renderer.domElement.resize(renderer, camera);
    };

    const tone = () => {
        if (!enabled) return;

        renderer.toneMapping = THREE.NoToneMapping;
    };

    const scroll = () => {
        if (!enabled) return;

        group.position.y = (-scrollY + window.innerHeight) * 0.015 * -1;
    };

    const random = (min: number, max: number): number => {
        if (min < 0) {
            return min + Math.random() * (Math.abs(min) + max);
        } else {
            return Math.random() * (max - min + 1) + min;
        }
    };

    const setupSpheres = () => {
        for (let index = 0; index < 100; index++) {
            const geometry = new THREE.IcosahedronGeometry(1, 15);

            const mat = material.clone();
            mat.uniforms.diffuse.value = new THREE.Color(0x0a0aff);
            mat.uniforms.secondColor.value = new THREE.Color(0xffffff);

            const mesh = new THREE.Mesh(geometry, mat);
            mesh.position.copy(
                new Vector3(random(-20, 20), random(-50, 10), random(-10, 5))
            );
            mesh.scale.setScalar(random(0.3, 2));

            group.add(mesh);
        }

        group.children.forEach((f: any) => {
            // movement
            const speed = 0.0005;
            f.velocity = new THREE.Vector3(speed, speed, 0);

            // rotation
            const object = f as SphereDTO;
            object.time = Math.floor(random(1, 2)) > 1 ? true : false;
            object.rotationX = random(-3, 3);
            object.rotationY = random(-2, 2);

            map.set(f.uuid, object);
        });
    };

    const loop = () => {
        if (!enabled) return;

        requestAnimationFrame(loop);

        const time = clock.getElapsedTime();

        if (mounted) {
            map.forEach((f: any) => {
                const uniforms = time * 0.001;
                f.material.uniforms.time.value = f.time ? uniforms : -uniforms;
                f.rotation.x = time * f.rotationX;
                f.rotation.y = time * f.rotationY;

                // Update the object's position based on its velocity
                f.position.add(f.velocity);

                // Check if the object is close to the scene boundaries
                if (f.position.x < -10 || f.position.x > 10) {
                    f.velocity.x *= -1; // Reverse the velocity in the x direction
                }
                if (f.position.y < -10 || f.position.y > 10) {
                    f.velocity.y *= -1; // Reverse the velocity in the y direction
                }
                if (f.position.z < -10 || f.position.z > 10) {
                    f.velocity.z *= -1; // Reverse the velocity in the z direction
                }
            });
        }

        renderer.render(scene, camera);
    };
</script>

<svelte:window
    on:resize={() => resize()}
    on:orientationchange={() => resize()}
/>

<Fog {scene} color={0x000099} near={10} far={25} />
