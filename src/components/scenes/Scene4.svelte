<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import * as THREE from "three";
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    // @ts-ignore
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";

    export let models: any[] = [];
    export let textures: any[] = [];
    export let renderer: THREE.WebGLRenderer;
    export let camera: THREE.PerspectiveCamera;
    export let scrollY: number;
    export let enabled: boolean;
    $: enabled, loop();
    $: enabled, resize();
    $: enabled, tone();
    $: enabled, show();
    $: textures, setupParticles();

    const dispatch = createEventDispatcher();
    const scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        10000,
    );
    camera.position.set(0, 0, 250);
    scene.userData.camera = camera;
    scene.userData.scene = 4;
    let mounted = false;
    let clock = new THREE.Clock();
    let particles: any;
    let texture: any;

    const group = new THREE.Group();

    onMount(() => init());

    const init = () => {
        gsap.registerPlugin(ScrollTrigger);

        scene.add(group);

        mounted = true;

        renderer.compile(scene, camera);

        dispatch("mount", { scene });
    };

    const resize = () => {
        if (!enabled) return;
        if (!texture) return;

        if (particles) {
            const fovHeight =
                2 *
                Math.tan((camera.fov * Math.PI) / 180 / 2) *
                camera.position.z;
            const scale = fovHeight / texture.image.height;
            particles.scale.set(scale, scale, 1);
        }

        renderer.domElement.resize(renderer, camera);
    };

    const tone = () => {
        if (!enabled) return;

        renderer.toneMappingExposure = 1;
    };

    const setupParticles = () => {
        if (!textures || textures.length == 0) return;
        texture = textures[0];

        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBAFormat;

        const numPoints = texture.image.width * texture.image.height;

        let numVisible = numPoints;
        let threshold = 0;
        let originalColors;

        // discard pixels darker than threshold #22
        numVisible = 0;
        threshold = 34;

        const img = texture.image;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = texture.image.width;
        canvas.height = texture.image.height;
        ctx?.scale(1, -1);
        ctx?.drawImage(
            img,
            0,
            0,
            texture.image.width,
            texture.image.height * -1,
        );

        const imgData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imgData) return;
        originalColors = Float32Array.from(imgData.data);

        for (let i = 0; i < numPoints; i++) {
            if (originalColors[i * 4 + 0] > threshold) numVisible++;
        }

        const uniforms = {
            uTime: { value: 0 },
            uRandom: { value: 1.0 },
            uDepth: { value: 2.0 },
            uSize: { value: 0.0 },
            uTextureSize: {
                value: new THREE.Vector2(
                    texture.image.width,
                    texture.image.height,
                ),
            },
            uTexture: { value: texture },
            uTouch: { value: null },
        };

        const material = new THREE.RawShaderMaterial({
            uniforms,
            vertexShader:
                document.getElementById("particles-vs")?.textContent ?? "",
            fragmentShader:
                document.getElementById("particles-fs")?.textContent ?? "",
            depthTest: false,
            transparent: true,
        });

        const geometry = new THREE.InstancedBufferGeometry();

        // positions
        const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
        positions.setXYZ(0, -0.5, 0.5, 0.0);
        positions.setXYZ(1, 0.5, 0.5, 0.0);
        positions.setXYZ(2, -0.5, -0.5, 0.0);
        positions.setXYZ(3, 0.5, -0.5, 0.0);
        geometry.setAttribute("position", positions);

        // uvs
        const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
        uvs.setXYZ(0, 0.0, 0.0, 0.0);
        uvs.setXYZ(1, 1.0, 0.0, 0.0);
        uvs.setXYZ(2, 0.0, 1.0, 0.0);
        uvs.setXYZ(3, 1.0, 1.0, 0.0);
        geometry.setAttribute("uv", uvs);

        // index
        geometry.setIndex(
            new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1),
        );

        const indices = new Uint16Array(numPoints);
        const offsets = new Float32Array(numPoints * 3);
        const angles = new Float32Array(numPoints);

        for (let i = 0; i < numPoints; i++) {
            offsets[i * 3 + 0] = i % texture.image.width;
            offsets[i * 3 + 1] = Math.floor(i / texture.image.width);

            indices[i] = i;

            angles[i] = Math.random() * Math.PI;
        }

        geometry.setAttribute(
            "pindex",
            new THREE.InstancedBufferAttribute(indices, 1, false),
        );
        geometry.setAttribute(
            "offset",
            new THREE.InstancedBufferAttribute(offsets, 3, false),
        );
        geometry.setAttribute(
            "angle",
            new THREE.InstancedBufferAttribute(angles, 1, false),
        );

        particles = new THREE.Mesh(geometry, material);
        scene.add(particles);
    };

    const show = () => {
        if (!enabled) return;

        const time = 1;
        gsap.fromTo(
            particles.material.uniforms.uSize,
            time,
            { value: 0.5 },
            { value: 1.5 },
        );
        gsap.to(particles.material.uniforms.uRandom, time, {
            value: 2.0,
        });
        gsap.fromTo(
            particles.material.uniforms.uDepth,
            time * 1,
            { value: 40.0 },
            { value: 4.0 },
        );
    };

    const loop = () => {
        if (!enabled) return;

        requestAnimationFrame(loop);

        const time = clock.getDelta();

        if (mounted) {
            particles.material.uniforms.uTime.value += time;
        }
    };
</script>

<svelte:window
    on:resize={() => resize()}
    on:orientationchange={() => resize()}
/>
