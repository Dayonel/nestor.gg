<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { Star } from "./Star";
    import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
    import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
    import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

    export let scene: THREE.Scene;
    export let camera: THREE.PerspectiveCamera;
    export let renderer: THREE.WebGLRenderer;
    export let sparklesGeometry: THREE.BufferGeometry;
    export let sparklesMaterial: THREE.ShaderMaterial;

    let pixelRatio = 2;
    const colors = [
        new THREE.Color("#b1b7be"),
        new THREE.Color("#1EE3CF"),
        new THREE.Color("#6B48FF"),
        new THREE.Color("#125D98"),
    ];

    let group: THREE.Group;
    let composer: any;
    let bloomPass: any;

    const stars: any[] = [];
    const galaxyGeometryVertices: any[] = [];
    const galaxyGeometryColors: any[] = [];
    const galaxyGeometrySizes: any[] = [];
    let galaxyPoints: THREE.Points;
    let starsGeometry: THREE.BufferGeometry;

    onMount(() => {
        const renderScene = new RenderPass(scene, camera);
        const strength = 1.75;
        const radius = 0.5;
        const threshold = 0;
        bloomPass = new UnrealBloomPass(
            new THREE.Vector2(
                window.innerWidth * window.devicePixelRatio,
                window.innerHeight * window.devicePixelRatio
            ),
            strength,
            radius,
            threshold
        );

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
            let starPixelRatio = Math.max(pixelRatio, window.devicePixelRatio);
            if (starPixelRatio > pixelRatio) starPixelRatio *= 2;

            const star = new Star(starPixelRatio);
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
