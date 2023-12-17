<script lang="ts">
    import * as THREE from "three";
    import { Vector3 } from "three";
    import { createEventDispatcher, onMount } from "svelte";
    import SpotLight from "$lib/SpotLight.svelte";
    import DirectionalLight from "$lib/DirectionalLight.svelte";
    import Background from "$lib/Background.svelte";
    import PointLight from "$lib/PointLight.svelte";
    import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

    export let models: any[] = [];
    export let textures: any[] = [];
    export let renderer: THREE.WebGLRenderer;
    export let enabled: boolean;

    $: enabled, loop();
    $: enabled, tone();
    $: enabled, resize();
    $: models, meshToParticles();
    $: textures, meshToParticles();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        30000,
    );
    camera.position.set(0, 0, 2);
    scene.add(camera);
    scene.userData.camera = camera;
    scene.userData.scene = 2;

    const dispatch = createEventDispatcher();

    let mounted = false;
    let pointsMaterial: any;
    let clock = new THREE.Clock();

    let vertexShader: any;
    let fragmentShader: any;
    let particlesLoaded = false;

    onMount(async () => await init());

    const init = async () => {
        renderer.compile(scene, camera);

        mounted = true;

        dispatch("mount", { scene });
    };

    const meshToParticles = async () => {
        if (!models || models.length < 5) return;
        if (!textures || textures.length < 3) return;
        if (particlesLoaded) return;

        const model = models[4];

        // pointsMaterial = new CustomShaderMaterial({
        //     baseMaterial: new THREE.PointsMaterial({
        //         color: 0xf38ba0,
        //         size: 0.01,
        //     }),
        //     vertexShader: vertexShader,//document.getElementById('surfacesampling-vs')?.textContent,
        //     fragmentShader: fragmentShader,//document.getElementById('surfacesampling-fs')?.textContent,
        //     uniforms: {
        //         uShift: {
        //             value: 0,
        //         },
        //         uShape: {
        //             value: textures[2],
        //         },
        //         uScale: {
        //             value: window.innerHeight / 2,
        //         },
        //         uTime: {
        //             value: 0,
        //         },
        //         uTargetPos: {
        //             value: new THREE.Vector3(0),
        //         },
        //     },
        //     passthrough: {
        //         size: 0.01,
        //     },
        // });

        model.traverse((obj: any) => {
            if (obj.isMesh) {
                const sampler = new MeshSurfaceSampler(obj).build();

                /* Sample the coordinates */
                const vertices = [];
                const tempPosition = new THREE.Vector3();
                for (let i = 0; i < 15000; i++) {
                    sampler.sample(tempPosition);
                    vertices.push(
                        tempPosition.x,
                        tempPosition.y,
                        tempPosition.z,
                    );
                }

                /* Create a geometry from the coordinates */
                const pointsGeometry = new THREE.BufferGeometry();
                pointsGeometry.setAttribute(
                    "position",
                    new THREE.Float32BufferAttribute(vertices, 3),
                );

                /* Create a material */
                const uniforms = {
                    uShift: {
                        value: 0,
                    },
                    uShape: {
                        value: textures[2],
                    },
                    uScale: {
                        value: window.innerHeight / 2,
                    },
                    uTime: {
                        value: 0,
                    },
                    uTargetPos: {
                        value: new THREE.Vector3(0),
                    },
                    uResolution: { value: new THREE.Vector3() },
                };

                pointsMaterial = new THREE.PointsMaterial({
                    color: 0xf38ba0,
                    size: 0.01,
                });

                pointsMaterial.onBeforeCompile = (shader: any) => {
                    shader.uniforms.uShift = uniforms.uShift;
                    shader.uniforms.uShape = uniforms.uShape;
                    shader.uniforms.uScale = uniforms.uScale;
                    shader.uniforms.uTime = uniforms.uTime;
                    shader.uniforms.uTargetPos = uniforms.uTargetPos;
                    shader.uniforms.uResolution = uniforms.uResolution;
                    // shader.vertexShader =
                    //     document.getElementById("surfacesampling-vs")
                    //         ?.textContent ?? "";
                    // shader.fragmentShader =
                    //     document.getElementById("surfacesampling-fs")
                    //         ?.textContent ?? "";
                };

                pointsMaterial.needsUpdate = true;

                ////////

                /* Create a Points object */
                const points = new THREE.Points(pointsGeometry, pointsMaterial);

                /* Add the points into the scene */
                scene.add(points);
            }
        });

        particlesLoaded = true;
    };

    const tone = () => {
        if (!enabled) return;
    };

    const resize = () => {
        if (!enabled) return;

        renderer.domElement.resize(renderer, camera);
    };

    const loop = () => {
        if (!enabled) return;

        requestAnimationFrame(loop);

        const time = clock.getDelta();

        if (pointsMaterial && pointsMaterial.uniforms) {
            pointsMaterial.uniforms.uTime.value = time;
        }
    };
</script>

<svelte:window
    on:resize={() => resize()}
    on:orientationchange={() => resize()}
/>

<Background {scene} color={0xc22fca} position={new Vector3(0, 0, -5)} />

<SpotLight
    {scene}
    color={0xffffff}
    intensity={2000}
    position={new Vector3(0, 50, -1)}
/>

<DirectionalLight
    {scene}
    color={0xf2f2f2}
    intensity={1}
    position={new Vector3(-1, 1.75, 1)}
    scale={30}
/>
