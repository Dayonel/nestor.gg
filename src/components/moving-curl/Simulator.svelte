<script lang="ts">
    import * as THREE from "three";
    import { onMount } from "svelte";
    import Particles from "./Particles.svelte";
    import { Settings } from "./Settings";

    export let renderer: THREE.WebGLRenderer;
    export let scene: THREE.Scene;
    export let camera: THREE.PerspectiveCamera;
    export let move: boolean = true;
    export let positionRenderTarget: any;
    export let prevPositionRenderTarget: any;

    let followPoint = new THREE.Vector3();
    let copyShader: any;
    let positionShader: any;
    let positionRenderTarget2: any;
    let mesh: THREE.Mesh;
    let textureDefaultPosition: any;
    let followPointTime = 0;

    onMount(() => {
        init();
        console.log("simulator mounted");
    });

    const init = () => {
        const u1 = {
            resolution: {
                type: "v2",
                value: new THREE.Vector2(
                    Settings.TEXTURE_WIDTH,
                    Settings.TEXTURE_HEIGHT,
                ),
            },
            texture: {
                type: "t",
                value: undefined,
            },
        };

        copyShader = new THREE.RawShaderMaterial({
            uniforms: u1,
            vertexShader:
                document.getElementById("curl-position-vs")?.textContent ?? "",
            fragmentShader:
                document.getElementById("curl-position-fs")?.textContent ?? "",
        });

        const u2 = {
            resolution: {
                type: "v2",
                value: new THREE.Vector2(
                    Settings.TEXTURE_WIDTH,
                    Settings.TEXTURE_HEIGHT,
                ),
            },
            texturePosition: { type: "t", value: undefined },
            textureDefaultPosition: { type: "t", value: undefined },
            mouse3d: { type: "v3", value: new THREE.Vector3() },
            speed: { type: "f", value: 1 },
            dieSpeed: { type: "f", value: 0 },
            radius: { type: "f", value: 0 },
            curlSize: { type: "f", value: 0 },
            attraction: { type: "f", value: 0 },
            time: { type: "f", value: 0 },
            initAnimation: { type: "f", value: 0 },
        };

        positionShader = new THREE.RawShaderMaterial({
            uniforms: u2,
            vertexShader:
                document.getElementById("curl-position-vs")?.textContent ?? "",
            fragmentShader:
                document.getElementById("curl-position-fs")?.textContent ?? "",
            blending: THREE.NoBlending,
            transparent: false,
            depthWrite: false,
            depthTest: false,
        });

        mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), copyShader);
        scene.add(mesh);

        positionRenderTarget = new THREE.WebGLRenderTarget(
            Settings.TEXTURE_WIDTH,
            Settings.TEXTURE_HEIGHT,
            {
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                minFilter: THREE.NearestFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat,
                type: THREE.FloatType,
                // depthWrite: false, // TODO
                depthBuffer: false,
                stencilBuffer: false,
            },
        );
        positionRenderTarget2 = positionRenderTarget.clone();
        copyTexture(createPositionTexture(), positionRenderTarget);
        copyTexture(positionRenderTarget, positionRenderTarget2);

        requestAnimationFrame(loop);
    };

    const createPositionTexture = () => {
        var positions = new Float32Array(Settings.AMOUNT * 4);
        var i4;
        var r, phi, theta;
        for (var i = 0; i < Settings.AMOUNT; i++) {
            i4 = i * 4;
            // r = (0.5 + Math.pow(Math.random(), 0.4) * 0.5) * 50;
            r = (0.5 + Math.random() * 0.5) * 50;
            phi = (Math.random() - 0.5) * Math.PI;
            theta = Math.random() * Math.PI * 2;
            positions[i4 + 0] = r * Math.cos(theta) * Math.cos(phi);
            positions[i4 + 1] = r * Math.sin(phi);
            positions[i4 + 2] = r * Math.sin(theta) * Math.cos(phi);
            positions[i4 + 3] = Math.random();
        }
        var texture = new THREE.DataTexture(
            positions,
            Settings.TEXTURE_WIDTH,
            Settings.TEXTURE_HEIGHT,
            THREE.RGBAFormat,
            THREE.FloatType,
        );
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.needsUpdate = true;
        texture.generateMipmaps = false;
        texture.flipY = false;
        textureDefaultPosition = texture;
        return texture;
    };

    const updatePosition = (dt: any) => {
        // swap
        var tmp = positionRenderTarget;
        positionRenderTarget = positionRenderTarget2;
        positionRenderTarget2 = tmp;

        mesh.material = positionShader;
        positionShader.uniforms.textureDefaultPosition.value =
            textureDefaultPosition;
        positionShader.uniforms.texturePosition.value = positionRenderTarget2;
        positionShader.uniforms.time.value += dt * 0.001;
        renderer.render(scene, camera);
    };

    const copyTexture = (input: any, output: any) => {
        mesh.material = copyShader;
        copyShader.uniforms.texture.value = input;
        console.log(copyShader);
        // renderer.render(scene, camera); TODO
    };

    const loop = (dt: number) => {
        requestAnimationFrame(loop);

        var r = 200;
        var h = 60;
        // if (settings.isMobile) { // TODO
        //     r = 100;
        //     h = 40;
        // }

        var autoClearColor = renderer.autoClearColor;
        var clearColor = renderer
            .getClearColor(new THREE.Color(0x000000))
            .getHex();
        var clearAlpha = renderer.getClearAlpha();

        renderer.autoClearColor = false;

        var deltaRatio = dt / 16.6667;

        positionShader.uniforms.speed.value = Settings.SPEED * deltaRatio;
        positionShader.uniforms.dieSpeed.value =
            Settings.DIE_SPEED * deltaRatio;
        positionShader.uniforms.radius.value = Settings.RADIUS;
        positionShader.uniforms.curlSize.value = Settings.CURL_SIZE;
        positionShader.uniforms.attraction.value = Settings.ATTRACTION;
        positionShader.uniforms.initAnimation.value = Settings.INIT_ANIMATION;

        // moving curl
        if (move) {
            followPointTime += dt * 0.001 * Settings.SPEED;
            followPoint.set(
                Math.cos(followPointTime) * r,
                Math.cos(followPointTime * 4.0) * h,
                Math.sin(followPointTime * 2.0) * r,
            );
            positionShader.uniforms.mouse3d.value.lerp(followPoint, 0.2);

            updatePosition(dt);

            renderer.setClearColor(clearColor, clearAlpha);
            renderer.autoClearColor = autoClearColor;
            positionRenderTarget = positionRenderTarget;
            prevPositionRenderTarget = positionRenderTarget2;
        }
    };
</script>
