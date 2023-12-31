<script lang="ts">
    import { Sparkle } from "./Sparkle";
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

    export let scene: THREE.Scene;
    export let object: any;
    export let sparklesGeometry: THREE.BufferGeometry;

    const sparkles: any[] = [];
    let sampler: any = null;
    const lines: any[] = [];
    let _prev = 0;
    let p1: THREE.Vector3;
    const sparklesCount = 40000;
    const colors = [
        new THREE.Color("#CFD6DE"),
        new THREE.Color("#1EE3CF"),
        new THREE.Color("#6B48FF"),
        new THREE.Color("#125D98"),
    ];
    const pixelRatio = 2;
    let group: THREE.Group;

    onMount(() => {
        group = new THREE.Group();
        scene.add(group);
        p1 = new THREE.Vector3();
        loadSampler();
        requestAnimationFrame(loop);
    });

    const loadSampler = () => {
        sampler = new MeshSurfaceSampler(object).build();

        for (let i = 0; i < 8; i++) {
            const linesMaterial = new THREE.LineBasicMaterial({
                color: colors[i % 4],
                transparent: true,
                opacity: 1,
            });
            const linesMesh = new THREE.Line(
                new THREE.BufferGeometry(),
                linesMaterial
            );
            // @ts-ignore
            linesMesh.coordinates = [];
            // @ts-ignore
            linesMesh.previous = null;
            lines.push(linesMesh);
            group.add(linesMesh);
        }
    };

    const nextDot = (line: any) => {
        let ok = false;
        while (!ok) {
            sampler.sample(p1);
            if (line.previous && p1.distanceTo(line.previous) < 0.1) {
                line.coordinates.push(p1.x, p1.y, p1.z);
                line.previous = p1.clone();

                const spark = new Sparkle(pixelRatio);
                spark.setup(p1, line.material.color);
                sparkles.push(spark);
                ok = true;
            } else if (!line.previous) {
                line.previous = p1.clone();
            }
        }
    };

    function updateSparklesGeometry() {
        let tempSparklesArraySizes: any[] = [];
        let tempSparklesArrayColors: any[] = [];
        sparkles.forEach((s) => {
            tempSparklesArraySizes.push(s.size);
            tempSparklesArrayColors.push(s.color.r, s.color.g, s.color.b);
        });
        sparklesGeometry.setAttribute(
            "color",
            new THREE.Float32BufferAttribute(tempSparklesArrayColors, 3)
        );
        sparklesGeometry.setAttribute(
            "size",
            new THREE.Float32BufferAttribute(tempSparklesArraySizes, 1)
        );
    }

    const loop = (time: number) => {
        requestAnimationFrame(loop);
        if (sparkles.length == sparklesCount) return;

        if (time - _prev > 30) {
            lines.forEach((l) => {
                for (let i = 0; i < 20; i++) {
                    nextDot(l);
                }

                const tempVertices = new Float32Array(l.coordinates);
                l.geometry.setAttribute(
                    "position",
                    new THREE.BufferAttribute(tempVertices, 3)
                );
                l.geometry.computeBoundingSphere();
            });
            updateSparklesGeometry();
            _prev = time;

            let tempSparklesArray: any[] = [];
            sparkles.forEach((s) => {
                s.update();
                tempSparklesArray.push(s.x, s.y, s.z);
            });

            sparklesGeometry.setAttribute(
                "position",
                new THREE.Float32BufferAttribute(tempSparklesArray, 3)
            );
        }
    };
</script>
