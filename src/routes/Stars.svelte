<script lang="ts">
    import { onMount } from "svelte";

    // @ts-ignore
    import * as THREE from "three";
    import { Star } from "$lib/SurfaceSampling/Star";
    // @ts-ignore
    import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
    // @ts-ignore
    import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
    // @ts-ignore
    import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

    export let scene: THREE.Scene;
    export let camera: THREE.PerspectiveCamera;
    export let renderer: THREE.WebGLRenderer;
    export let sparklesGeometry: THREE.BufferGeometry;
    export let sparklesMaterial: THREE.ShaderMaterial;

    const pixelRatio = 2;
    const colors = [
        new THREE.Color("#CFD6DE").multiplyScalar(0.5),
        new THREE.Color("#1EE3CF").multiplyScalar(0.5),
        new THREE.Color("#6B48FF").multiplyScalar(0.5),
        new THREE.Color("#125D98").multiplyScalar(0.5),
    ];

    let group: THREE.Group;
    let composer: THREE.EffectComposer;
    let bloomPass: THREE.UnrealBloomPass;

    const stars: any[] = [];
    const galaxyGeometryVertices: any[] = [];
    const galaxyGeometryColors: any[] = [];
    const galaxyGeometrySizes: any[] = [];
    let galaxyPoints: THREE.Points;
    let starsGeometry: THREE.BufferGeometry;

    onMount(() => {
        const renderScene = new RenderPass(scene, camera);
        bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,
            0.4,
            0.85
        );
        bloomPass.threshold = 0;
        bloomPass.strength = 0.6;

        composer = new EffectComposer(renderer);
        composer.setPixelRatio(pixelRatio);
        composer.addPass(renderScene);
        composer.addPass(bloomPass);

        group = new THREE.Group();
        scene.add(group);

        const points = new THREE.Points(sparklesGeometry, sparklesMaterial);
        group.add(points);

        createStars();
    });

    const createStars = () => {
        for (let i = 0; i < 1500; i++) {
            const star = new Star(pixelRatio);
            star.setup(colors[Math.floor(Math.random() * colors.length)]);
            // @ts-ignore
            galaxyGeometryVertices.push(star.x, star.y, star.z);
            // @ts-ignore
            galaxyGeometryColors.push(star.color.r, star.color.g, star.color.b);
            // @ts-ignore
            galaxyGeometrySizes.push(star.size);
            stars.push(star);
        }
        starsGeometry = new THREE.BufferGeometry();
        starsGeometry.setAttribute(
            "size",
            new THREE.Float32BufferAttribute(galaxyGeometrySizes, 1)
        );
        starsGeometry.setAttribute(
            "color",
            new THREE.Float32BufferAttribute(galaxyGeometryColors, 3)
        );
        galaxyPoints = new THREE.Points(starsGeometry, sparklesMaterial);
        scene.add(galaxyPoints);
    };

    export const onResize = () => {
        composer.setSize(window.innerWidth, window.innerHeight);
        bloomPass.setSize(window.innerWidth, window.innerHeight);
    };

    export const loop = () => {
        galaxyPoints.rotation.y += 0.0005;

        let tempStarsArray: any[] = [];
        stars.forEach((s) => {
            s.update();
            tempStarsArray.push(s.x, s.y, s.z);
        });

        starsGeometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(tempStarsArray, 3)
        );

        composer.render();
    };
</script>
