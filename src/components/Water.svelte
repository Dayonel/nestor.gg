<script lang="ts">
    import { onMount } from "svelte";
    import { PlaneGeometry, Vector2, MathUtils } from "three";
    import { Water } from "three/examples/jsm/objects/Water2.js";

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
        const waterGeometry = new PlaneGeometry(50, 50);

        water = new Water(waterGeometry, {
            color: params.color,
            scale: params.scale,
            flowDirection: new Vector2(params.flowX, params.flowY),
            // textureWidth: 1024,
            // textureHeight: 1024,
            reflectivity: 1,
        });

        water.position.z = 26;
        water.position.y = -0.05;
        water.rotation.x = MathUtils.degToRad(-90);
        scene.add(water);

        console.log("water has mounted");
    };
</script>
