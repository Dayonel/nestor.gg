<script lang="ts">
    import { onMount } from "svelte";
    // @ts-ignore
    import * as THREE from "three";
    // @ts-ignore
    import { Water } from "three/addons/objects/Water2.js";

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
            reflectivity: 1,
        });

        water.position.z = 50;
        water.position.y = -0.05;
        water.rotation.x = THREE.MathUtils.degToRad(-90);
        scene.add(water);
    };
</script>
