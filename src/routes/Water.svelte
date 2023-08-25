<script lang="ts">
    import { onMount } from "svelte";
    // @ts-ignore
    import * as THREE from "three";
    // @ts-ignore
    import { Water } from "three/addons/objects/Water2.js";

    export let scene: THREE.Scene;

    let water: any;
    let groundMirror: any;

    const params = {
        color: "#ffffff",
        scale: 20,
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

        water.position.z = 7.5;
        water.position.y = -0.25;
        water.rotation.x = THREE.MathUtils.degToRad(-90);
        scene.add(water);

        // lights
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
        directionalLight.position.set(0, 10, 0);
        scene.add(directionalLight);

        const light = new THREE.AmbientLight(0x404040, 10); // soft white light
        scene.add(light);
    };

    export const onResize = () => {
        groundMirror
            .getRenderTarget()
            .setSize(
                window.innerWidth * window.devicePixelRatio,
                window.innerHeight * window.devicePixelRatio
            );
    };
</script>
