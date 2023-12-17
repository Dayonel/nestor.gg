<script lang="ts">
    import * as THREE from "three";
    import { onMount } from "svelte";
    import { Settings } from "./Settings";
    import Simulator from "./Simulator.svelte";

    export let renderer: THREE.WebGLRenderer;
    export let scene: THREE.Scene;
    export let camera: THREE.PerspectiveCamera;
    export let move: boolean = true;

    let positionRenderTarget: any;
    let prevPositionRenderTarget: any;

    let particleMesh: any;
    let triangleMesh: any;
    let meshes: any;

    let color1: any;
    let color2: any;
    let tmpColor: any;
    let container: any;

    onMount(() => {
        init();
        console.log("particles mounted");
    });

    const init = () => {
        container = new THREE.Object3D();

        tmpColor = new THREE.Color();
        color1 = new THREE.Color(Settings.COLOR1);
        color2 = new THREE.Color(Settings.COLOR2);

        meshes = [
            (triangleMesh = createTriangleMesh()),
            (particleMesh = createParticleMesh()),
        ];
        triangleMesh.visible = false;
        particleMesh.visible = false;

        scene.add(container);

        requestAnimationFrame(loop);
    };

    const createParticleMesh = () => {
        var position = new Float32Array(Settings.AMOUNT * 3);
        var i3;
        for (var i = 0; i < Settings.AMOUNT; i++) {
            i3 = i * 3;
            position[i3 + 0] =
                (i % Settings.TEXTURE_WIDTH) / Settings.TEXTURE_WIDTH;
            position[i3 + 1] =
                ~~(i / Settings.TEXTURE_WIDTH) / Settings.TEXTURE_HEIGHT;
        }
        var geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(position, 3),
        );

        const u1 = THREE.UniformsUtils.merge([
            THREE.UniformsLib.shadowmap, // TODO
            {
                texturePosition: { type: "t", value: undefined },
                flipRatio: { type: "f", value: 0 },
                color1: { type: "c", value: undefined },
                color2: { type: "c", value: undefined },
                cameraMatrix: { type: "m4", value: undefined },
            },
        ]);

        var material = new THREE.ShaderMaterial({
            uniforms: u1,
            vertexShader:
                document.getElementById("curl-particles-vs")?.textContent ?? "",
            fragmentShader:
                document.getElementById("curl-particles-fs")?.textContent ?? "",
            blending: THREE.NoBlending,
        });

        material.uniforms.color1.value = Settings.COLOR1;
        material.uniforms.color2.value = Settings.COLOR2;

        var mesh = new THREE.Points(geometry, material);

        const u2 = {
            lightPos: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
            texturePosition: { type: "t", value: undefined },
        };

        mesh.customDistanceMaterial = new THREE.ShaderMaterial({
            uniforms: u2,
            vertexShader:
                document.getElementById("curl-particles-distance-vs")
                    ?.textContent ?? "",
            fragmentShader:
                document.getElementById("curl-particles-distance-fs")
                    ?.textContent ?? "",
            depthTest: true,
            depthWrite: true,
            side: THREE.BackSide,
            blending: THREE.NoBlending,
        });

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        container.add(mesh);

        return mesh;
    };

    const createTriangleMesh = () => {
        var position = new Float32Array(Settings.AMOUNT * 3 * 3);
        var positionFlip = new Float32Array(Settings.AMOUNT * 3 * 3);
        var fboUV = new Float32Array(Settings.AMOUNT * 2 * 3);

        var PI = Math.PI;
        var angle = (PI * 2) / 3;
        var angles = [
            Math.sin(angle * 2 + PI),
            Math.cos(angle * 2 + PI),
            Math.sin(angle + PI),
            Math.cos(angle + PI),
            Math.sin(angle * 3 + PI),
            Math.cos(angle * 3 + PI),
            Math.sin(angle * 2),
            Math.cos(angle * 2),
            Math.sin(angle),
            Math.cos(angle),
            Math.sin(angle * 3),
            Math.cos(angle * 3),
        ];
        var i6, i9;
        for (var i = 0; i < Settings.AMOUNT; i++) {
            i6 = i * 6;
            i9 = i * 9;
            if (i % 2) {
                position[i9 + 0] = angles[0];
                position[i9 + 1] = angles[1];
                position[i9 + 3] = angles[2];
                position[i9 + 4] = angles[3];
                position[i9 + 6] = angles[4];
                position[i9 + 7] = angles[5];

                positionFlip[i9 + 0] = angles[6];
                positionFlip[i9 + 1] = angles[7];
                positionFlip[i9 + 3] = angles[8];
                positionFlip[i9 + 4] = angles[9];
                positionFlip[i9 + 6] = angles[10];
                positionFlip[i9 + 7] = angles[11];
            } else {
                positionFlip[i9 + 0] = angles[0];
                positionFlip[i9 + 1] = angles[1];
                positionFlip[i9 + 3] = angles[2];
                positionFlip[i9 + 4] = angles[3];
                positionFlip[i9 + 6] = angles[4];
                positionFlip[i9 + 7] = angles[5];

                position[i9 + 0] = angles[6];
                position[i9 + 1] = angles[7];
                position[i9 + 3] = angles[8];
                position[i9 + 4] = angles[9];
                position[i9 + 6] = angles[10];
                position[i9 + 7] = angles[11];
            }

            fboUV[i6 + 0] =
                fboUV[i6 + 2] =
                fboUV[i6 + 4] =
                    (i % Settings.TEXTURE_WIDTH) / Settings.TEXTURE_WIDTH;
            fboUV[i6 + 1] =
                fboUV[i6 + 3] =
                fboUV[i6 + 5] =
                    ~~(i / Settings.TEXTURE_WIDTH) / Settings.TEXTURE_HEIGHT;
        }
        var geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(position, 3),
        );
        geometry.setAttribute(
            "positionFlip",
            new THREE.BufferAttribute(positionFlip, 3),
        );
        geometry.setAttribute("fboUV", new THREE.BufferAttribute(fboUV, 2));

        const u2 = THREE.UniformsUtils.merge([
            THREE.UniformsLib.shadowmap, // TODO
            {
                texturePosition: { type: "t", value: undefined },
                flipRatio: { type: "f", value: 0 },
                color1: { type: "c", value: undefined },
                color2: { type: "c", value: undefined },
                cameraMatrix: { type: "m4", value: undefined },
            },
        ]);

        var material = new THREE.ShaderMaterial({
            uniforms: u2,
            vertexShader:
                document.getElementById("curl-triangles-vs")?.textContent ?? "",
            fragmentShader:
                document.getElementById("curl-particles-fs")?.textContent ?? "",
            blending: THREE.NoBlending,
        });

        material.uniforms.color1.value = color1;
        material.uniforms.color2.value = color2;
        material.uniforms.cameraMatrix.value = camera.matrixWorld;

        var mesh = new THREE.Mesh(geometry, material);

        const u3 = {
            lightPos: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
            texturePosition: { type: "t", value: undefined },
            flipRatio: { type: "f", value: 0 },
        };

        mesh.customDistanceMaterial = new THREE.ShaderMaterial({
            uniforms: u3,
            vertexShader:
                document.getElementById("curl-triangles-distance-vs")
                    ?.textContent ?? "",
            fragmentShader:
                document.getElementById("curl-particles-distance-fs")
                    ?.textContent ?? "",
            depthTest: true,
            depthWrite: true,
            side: THREE.BackSide,
            blending: THREE.NoBlending,
        });

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        container.add(mesh);

        return mesh;
    };

    const loop = () => {
        requestAnimationFrame(loop);

        triangleMesh.visible = Settings.USE_TRIANGLE_PARTICLES;
        particleMesh.visible = !Settings.USE_TRIANGLE_PARTICLES;

        tmpColor.setStyle(Settings.COLOR1);
        color1.lerp(tmpColor, 0.05);

        tmpColor.setStyle(Settings.COLOR2);
        color2.lerp(tmpColor, 0.05);

        for (var i = 0; i < 2; i++) {
            const mesh = meshes[i];
            mesh.material.uniforms.texturePosition.value = positionRenderTarget;
            mesh.customDistanceMaterial.uniforms.texturePosition.value =
                positionRenderTarget;
            if (mesh.material.uniforms.flipRatio) {
                mesh.material.uniforms.flipRatio.value ^= 1;
                mesh.customDistanceMaterial.uniforms.flipRatio.value ^= 1;
            }
        }
    };
</script>

<Simulator
    {renderer}
    {scene}
    {camera}
    bind:positionRenderTarget
    bind:prevPositionRenderTarget
></Simulator>
