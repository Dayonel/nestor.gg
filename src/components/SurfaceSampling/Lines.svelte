<script lang="ts">
    import { enhance } from "$app/forms";
    import { Path } from "./Path";
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

    export let scene: THREE.Scene;
    export let object: any;
    export let mounted = false;
    export let enabled: boolean;

    $: object, init();
    $: enabled, init();

    const pathCount = 700;
    let sampler: any = null;
    let paths: any[] = [];
    let group: THREE.Group;
    const materials = [
        new THREE.LineBasicMaterial({
            color: 0xcfd6de,
            transparent: true,
            opacity: 0.5,
        }),
        new THREE.LineBasicMaterial({
            color: 0x1ee3cf,
            transparent: true,
            opacity: 0.5,
        }),
        new THREE.LineBasicMaterial({
            color: 0x6b48ff,
            transparent: true,
            opacity: 0.5,
        }),
        new THREE.LineBasicMaterial({
            color: 0x125d98,
            transparent: true,
            opacity: 0.5,
        }),
    ];

    const init = () => {
        if (!enabled) return;
        if (!object) return;
        if (mounted) return;

        group = new THREE.Group();
        scene.add(group);
        loadSampler();
        requestAnimationFrame(loop);
        mounted = true;
    };

    const loadSampler = () => {
        sampler = new MeshSurfaceSampler(object).build();

        for (let i = 0; i < 64; i++) {
            const path = new Path(sampler, materials, i);
            paths.push(path);
            // @ts-ignore
            group.add(path.line);
        }
    };

    const loop = () => {
        if (!enabled) return;

        requestAnimationFrame(loop);

        paths.forEach((path) => {
            if (path.vertices.length < pathCount) {
                path.update();
            }
        });
    };
</script>
