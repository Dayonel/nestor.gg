<script lang="ts">
    import { onMount } from "svelte";
    // @ts-ignore
    import * as THREE from "three";
    // @ts-ignore
    import { Water } from "three/addons/objects/Water2.js";
    // @ts-ignore
    import { Reflector } from "three/addons/objects/Reflector.js";

    export let scene: THREE.Scene;

    let water: any;

    const params = {
        color: "#ffffff",
        scale: 4,
        flowX: 0.5,
        flowY: 0.5,
    };

    onMount(() => {
        init();
    });

    const init = () => {
        // water
        const waterGeometry = new THREE.PlaneGeometry(100, 100);

        water = new Water(waterGeometry, {
            color: params.color,
            scale: params.scale,
            flowDirection: new THREE.Vector2(params.flowX, params.flowY),
            textureWidth: 1024,
            textureHeight: 1024,
        });

        water.position.z = 50;
        water.position.y = -0.05;
        water.rotation.x = THREE.MathUtils.degToRad(-90);
        scene.add(water);

        // lights
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
        directionalLight.position.set(0, 10, 0);
        scene.add(directionalLight);

        const light = new THREE.AmbientLight(0x404040, 10); // soft white light
        scene.add(light);

        // ground
        const geometry = new THREE.PlaneGeometry(50, 50);
        const ground = new Reflector(geometry, {
            clipBias: 0.003,
            textureWidth: window.innerWidth * window.devicePixelRatio,
            textureHeight: window.innerHeight * window.devicePixelRatio,
            color: 0xb5b5b5,
        });
        ground.position.z = 25;
        ground.position.y = -0.1;
        ground.rotateX(-Math.PI / 2);
        scene.add(ground);
    };
</script>
