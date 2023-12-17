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

    let _scene = new THREE.Scene();
    let _camera = camera;
    _camera.position.z = 1;

    onMount(() => {
        init();
        console.log("simulator mounted");
    });

    const init = () => {
        // var rawShaderPrefix =
        //     "precision " + renderer.capabilities.precision + " float;\n";

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
                document.getElementById("curl-through-fs")?.textContent ?? "",
        });

        positionShader = new THREE.RawShaderMaterial({
            uniforms: {
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
            },
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
        _scene.add(mesh);

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

        // TODO, scene and camera here is different
        renderer.setRenderTarget(positionRenderTarget);
        renderer.render(_scene, _camera);
        renderer.setRenderTarget(null);
    };

    const copyTexture = (input: any, output: any) => {
        mesh.material = copyShader;
        copyShader.uniforms.texture.value = input;

        // TODO, scene and camera here is different
        renderer.setRenderTarget(output);
        renderer.render(_scene, _camera);
        renderer.setRenderTarget(null);
    };

    // const parseShader = (shader: any) => {
    //     var threeChunkReplaceRegExp =
    //         /\/\/\s?chunkreplace\s(.+)([\d\D]+)\/\/\s?endchunkreplace/gm;
    //     var threeChunkRegExp = /\/\/\s?chunk\(\s?(\w+)\s?\);/g;
    //     var glslifyGlobalRegExp = /GLOBALVAR([^\.\)\;\,\s]+)(\d+)?/g;

    //     var chunkReplaceObj: any;

    //     function storeChunkReplaceParse(shader: any) {
    //         chunkReplaceObj = {};
    //         return shader.replace(
    //             threeChunkReplaceRegExp,
    //             storeChunkReplaceFunc,
    //         );
    //     }

    //     function threeChunkParse(shader: any) {
    //         return shader.replace(threeChunkRegExp, replaceThreeChunkFunc);
    //     }

    //     function glslifyGlobalParse(shader: any) {
    //         return shader.replace(glslifyGlobalRegExp, returnFirst);
    //     }

    //     function storeChunkReplaceFunc(a: any, b: any, c: any) {
    //         chunkReplaceObj[b.trim()] = c;
    //         return "";
    //     }

    //     function replaceThreeChunkFunc(a: any, b: any) {
    //         // @ts-ignore
    //         var str = THREE.ShaderChunk[b] + "\n";
    //         for (var id in chunkReplaceObj) {
    //             str = str.replace(id, chunkReplaceObj[id]);
    //         }
    //         return str;
    //     }

    //     function returnFirst(a: any, b: any) {
    //         return b;
    //     }

    //     shader = storeChunkReplaceParse(shader);
    //     shader = threeChunkParse(shader);
    //     return glslifyGlobalParse(shader);
    // };

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

        const initAnimation = Math.min(
            Settings.INIT_ANIMATION + dt * 0.00025,
            1,
        );
        positionShader.uniforms.initAnimation.value = initAnimation;

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
