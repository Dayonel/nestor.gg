<script lang="ts">
    import { onMount } from "svelte";

    // @ts-ignore
    import * as THREE from "three";

    export let scrollPercent: number;
    export let camera: THREE.PerspectiveCamera;
    export let scene: THREE.Scene;

    let cube: THREE.Mesh;
    let material: THREE.MeshBasicMaterial;
    let rotationEnabled: boolean = true;
    const animationScripts: { start: number; end: number; func: () => void }[] =
        [];

    onMount(() => {
        addGeometry();
        addAnimationScripts();

        // grid helper
        const gridHelper = new THREE.GridHelper(10, 10, 0xaec6cf, 0xaec6cf);
        scene.add(gridHelper);
    });

    const lerp = (x: number, y: number, a: number): number => {
        return (1 - a) * x + a * y;
    };

    const addGeometry = () => {
        const geometry = new THREE.BoxGeometry();
        material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
        });

        cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 0.5, -10);
        scene.add(cube);
    };

    const scalePercent = (start: number, end: number) => {
        return (scrollPercent - start) / (end - start);
    };

    export const addAnimationScripts = () => {
        //add an animation that flashes the cube through 100 percent of scroll
        animationScripts.push({
            start: 0,
            end: 101,
            func: () => {
                let g = material.color.g;
                g -= 0.05;
                if (g <= 0) {
                    g = 1.0;
                }
                material.color.g = g;
            },
        });

        //add an animation that moves the cube through first 40 percent of scroll
        animationScripts.push({
            start: 0,
            end: 40,
            func: () => {
                camera.lookAt(cube.position);
                camera.position.set(0, 1, 2);
                cube.position.z = lerp(-10, 0, scalePercent(0, 40));
                rotationEnabled = true;
            },
        });

        //add an animation that rotates the cube between 40-60 percent of scroll
        animationScripts.push({
            start: 40,
            end: 60,
            func: () => {
                camera.lookAt(cube.position);
                camera.position.set(0, 1, 2);
                cube.rotation.z = lerp(0, Math.PI, scalePercent(40, 60));
                rotationEnabled = true;
            },
        });

        //add an animation that moves the camera between 60-80 percent of scroll
        animationScripts.push({
            start: 60,
            end: 80,
            func: () => {
                camera.position.x = lerp(0, 5, scalePercent(60, 80));
                camera.position.y = lerp(1, 5, scalePercent(60, 80));
                camera.lookAt(cube.position);
                rotationEnabled = true;
            },
        });

        //add an animation that auto rotates the cube from 80 percent of scroll
        animationScripts.push({
            start: 80,
            end: 101,
            func: () => {
                //auto rotate
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
                rotationEnabled = false;
            },
        });
    };

    export const loop = () => {
        animationScripts.forEach((a) => {
            if (scrollPercent >= a.start && scrollPercent < a.end) {
                a.func();
            }
        });
    };
</script>
