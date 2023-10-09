<script lang="ts">
    import { onMount } from "svelte";
    // @ts-ignore
    import * as THREE from "three";

    export let scene: THREE.Scene;
    export let renderer: THREE.WebGLRenderer;
    export let cameraZ = 40;
    export let cameraY = 40;

    let sky: any;
    let time = 0;
    let shaderMaterial: any;

    onMount(async () => {
        await init();
    });

    const init = async () => {
        lights();
        skybox();
        loop();
    };

    const lights = () => {
        // sky color ground color intensity
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        hemiLight.position.set(0, 20, -20);
        scene.add(hemiLight);

        const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
        // scene.add(hemiLightHelper);

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

        const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
        // scene.add(dirLightHelper);
    };

    const skybox = () => {
        shaderMaterial = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable",
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { type: "f", value: 0 },
                uTexture: {
                    type: "t",
                    value: new THREE.TextureLoader().load(
                        "/textures/clouds.png"
                    ),
                },
                resolution: { type: "v4", value: new THREE.Vector4() },
                uvRate1: {
                    value: new THREE.Vector2(1, 1),
                },
            },
            transparent: true,
            vertexShader: document.getElementById("sky-vs")?.textContent,
            fragmentShader: document.getElementById("sky-fs")?.textContent,
            depthTest: false,
            depthWrite: false,
            //blending: THREE.MultiplyBlending,
        });

        const geometry = new THREE.PlaneGeometry(0.5, 0.5, 1, 1);
        const ig = new THREE.InstancedBufferGeometry();
        ig.attributes = geometry.attributes;
        ig.index = geometry.index;

        const number = 1000;
        let translateArray = new Float32Array(number * 3);
        let rotateArray = new Float32Array(number);
        let radius = 0.7;

        for (let i = 0; i < number; i++) {
            let theta = Math.random() * 2 * Math.PI;
            translateArray.set(
                [
                    radius * Math.sin(theta),
                    radius * Math.cos(theta),
                    -Math.random() * 5,
                ],
                3 * i
            );

            rotateArray.set([Math.random() * 2 * Math.PI], i);
        }

        ig.setAttribute(
            "translate",
            new THREE.InstancedBufferAttribute(translateArray, 3)
        );

        ig.setAttribute(
            "aRotate",
            new THREE.InstancedBufferAttribute(rotateArray, 1)
        );

        const plane = new THREE.Mesh(ig, shaderMaterial);
        plane.position.z = cameraZ - 10;
        plane.position.y = cameraY;
        scene.add(plane);
    };

    const loop = () => {
        requestAnimationFrame(loop);

        time += 0.05;
        shaderMaterial.uniforms.time.value = time;
    };
</script>
