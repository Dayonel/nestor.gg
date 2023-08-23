<script lang="ts">
    import { Path } from "$lib/SurfaceSampling/Path";
    import { Sparkle } from "$lib/SurfaceSampling/Sparkle";
    import { onMount } from "svelte";
    // @ts-ignore
    import * as THREE from "three";
    // @ts-ignore
    import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";

    export let scene: THREE.Scene;
    export let object: any;

    const pathCount = 1000;
    let sampler: any = null;
    let paths: any[] = [];
    let group: THREE.Group;
    const materials = [
        new THREE.LineBasicMaterial({
            color: 0xfaad80,
            transparent: true,
            opacity: 0.5,
        }),
        new THREE.LineBasicMaterial({
            color: 0xff6767,
            transparent: true,
            opacity: 0.5,
        }),
        new THREE.LineBasicMaterial({
            color: 0xff3d68,
            transparent: true,
            opacity: 0.5,
        }),
        new THREE.LineBasicMaterial({
            color: 0xa73489,
            transparent: true,
            opacity: 0.5,
        }),
    ];

    onMount(() => {
        group = new THREE.Group();
        scene.add(group);
        loadSampler();
        requestAnimationFrame(loop);
    });

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
        requestAnimationFrame(loop);

        paths.forEach((path) => {
            if (path.vertices.length < pathCount) {
                path.update();
            }
        });
    };
</script>
