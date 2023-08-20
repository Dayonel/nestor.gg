<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    // @ts-ignore
    import * as THREE from "three";

    export let scene: THREE.Scene;
    export let renderer: THREE.Scene;

    let texture: any;
    let uniforms: any;

    onMount(() => {
        const loader = new THREE.TextureLoader();

        loader.load("noisev2.png", (tex: any) => {
            texture = tex;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.minFilter = THREE.LinearFilter;
            init();
            loop(0);
        });
    });

    const init = () => {
        var geometry = new THREE.PlaneGeometry(2, 2);

        uniforms = {
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new THREE.Vector2() },
            u_noise: { type: "t", value: texture },
            u_mouse: { type: "v2", value: new THREE.Vector2() },
        };

        var material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: document.getElementById("cloud-vs")?.textContent,
            fragmentShader: document.getElementById("cloud-fs")?.textContent,
        });

        material.extensions.derivatives = true;
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        onResize();
        window.onresize = () => onResize();
    };

    const onResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.u_resolution.value.x = renderer.domElement.width;
        uniforms.u_resolution.value.y = renderer.domElement.height;
    };

    const loop = (delta: number) => {
        requestAnimationFrame(loop);

        uniforms.u_time.value = -8645 + delta * 0.0007;
    };
</script>
