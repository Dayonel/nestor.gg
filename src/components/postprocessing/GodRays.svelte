<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import {
        GodRaysFakeSunShader,
        GodRaysDepthMaskShader,
        GodRaysCombineShader,
        GodRaysGenerateShader,
    } from "three/examples/jsm/shaders/GodRaysShader.js";

    export let camera: THREE.PerspectiveCamera;
    export let scene: THREE.Scene;
    export let renderer: THREE.WebGLRenderer;
    export let bgColor = 0x000511;
    export let sunColor = 0xffee00;

    const sunPosition = new THREE.Vector3(0, 300, -1000);
    const clipPosition = new THREE.Vector4();
    const screenSpacePosition = new THREE.Vector3();

    const postprocessing: any = { enabled: true };

    const intensity = 0.75;

    // Use a smaller size for some of the god-ray render targets for better performance.
    const godrayRenderTargetResolutionMultiplier = 1.0 / 4;

    let sphereMesh: any;

    let materialDepth: THREE.MeshDepthMaterial;
    const orbitRadius = 200;

    onMount(() => {
        addGeometry();
        initPostprocessing(window.innerWidth, window.innerHeight);
    });

    const addGeometry = () => {
        // sphere
        const geo = new THREE.SphereGeometry(1, 20, 10);
        sphereMesh = new THREE.Mesh(
            geo,
            new THREE.MeshBasicMaterial({ color: 0x000000 })
        );
        sphereMesh.scale.multiplyScalar(20);
        scene.add(sphereMesh);
    };

    const initPostprocessing = (
        renderTargetWidth: any,
        renderTargetHeight: any
    ) => {
        renderer.autoClear = false;
        materialDepth = new THREE.MeshDepthMaterial();

        postprocessing.scene = new THREE.Scene();

        postprocessing.camera = new THREE.OrthographicCamera(
            -0.5,
            0.5,
            0.5,
            -0.5,
            -10000,
            10000
        );
        postprocessing.camera.position.z = 100;

        postprocessing.scene.add(postprocessing.camera);

        postprocessing.rtTextureColors = new THREE.WebGLRenderTarget(
            renderTargetWidth,
            renderTargetHeight,
            { type: THREE.HalfFloatType }
        );

        // Switching the depth formats to luminance from rgb doesn't seem to work. I didn't
        // investigate further for now.
        // pars.format = LuminanceFormat;

        // I would have this quarter size and use it as one of the ping-pong render
        // targets but the aliasing causes some temporal flickering

        postprocessing.rtTextureDepth = new THREE.WebGLRenderTarget(
            renderTargetWidth,
            renderTargetHeight,
            { type: THREE.HalfFloatType }
        );
        postprocessing.rtTextureDepthMask = new THREE.WebGLRenderTarget(
            renderTargetWidth,
            renderTargetHeight,
            { type: THREE.HalfFloatType }
        );

        // The ping-pong render targets can use an adjusted resolution to minimize cost

        const adjustedWidth =
            renderTargetWidth * godrayRenderTargetResolutionMultiplier;
        const adjustedHeight =
            renderTargetHeight * godrayRenderTargetResolutionMultiplier;
        postprocessing.rtTextureGodRays1 = new THREE.WebGLRenderTarget(
            adjustedWidth,
            adjustedHeight,
            { type: THREE.HalfFloatType }
        );
        postprocessing.rtTextureGodRays2 = new THREE.WebGLRenderTarget(
            adjustedWidth,
            adjustedHeight,
            { type: THREE.HalfFloatType }
        );

        // god-ray shaders

        const godraysMaskShader = GodRaysDepthMaskShader;
        postprocessing.godrayMaskUniforms = THREE.UniformsUtils.clone(
            godraysMaskShader.uniforms
        );
        postprocessing.materialGodraysDepthMask = new THREE.ShaderMaterial({
            uniforms: postprocessing.godrayMaskUniforms,
            vertexShader: godraysMaskShader.vertexShader,
            fragmentShader: godraysMaskShader.fragmentShader,
        });

        const godraysGenShader = GodRaysGenerateShader;
        postprocessing.godrayGenUniforms = THREE.UniformsUtils.clone(
            godraysGenShader.uniforms
        );
        postprocessing.materialGodraysGenerate = new THREE.ShaderMaterial({
            uniforms: postprocessing.godrayGenUniforms,
            vertexShader: godraysGenShader.vertexShader,
            fragmentShader: godraysGenShader.fragmentShader,
        });

        const godraysCombineShader = GodRaysCombineShader;
        postprocessing.godrayCombineUniforms = THREE.UniformsUtils.clone(
            godraysCombineShader.uniforms
        );
        postprocessing.materialGodraysCombine = new THREE.ShaderMaterial({
            uniforms: postprocessing.godrayCombineUniforms,
            vertexShader: godraysCombineShader.vertexShader,
            fragmentShader: godraysCombineShader.fragmentShader,
        });

        const godraysFakeSunShader = GodRaysFakeSunShader;
        postprocessing.godraysFakeSunUniforms = THREE.UniformsUtils.clone(
            godraysFakeSunShader.uniforms
        );
        postprocessing.materialGodraysFakeSun = new THREE.ShaderMaterial({
            uniforms: postprocessing.godraysFakeSunUniforms,
            vertexShader: godraysFakeSunShader.vertexShader,
            fragmentShader: godraysFakeSunShader.fragmentShader,
        });

        postprocessing.godraysFakeSunUniforms.bgColor.value.setHex(bgColor);
        postprocessing.godraysFakeSunUniforms.sunColor.value.setHex(sunColor);

        postprocessing.godrayCombineUniforms.fGodRayIntensity.value = intensity;

        postprocessing.quad = new THREE.Mesh(
            new THREE.PlaneGeometry(1.0, 1.0),
            postprocessing.materialGodraysGenerate
        );
        postprocessing.quad.position.z = -9900;
        postprocessing.scene.add(postprocessing.quad);
    };

    const getStepSize = (filterLen: any, tapsPerPass: any, pass: any) => {
        return filterLen * Math.pow(tapsPerPass, -pass);
    };

    const filterGodRays = (inputTex: any, renderTarget: any, stepSize: any) => {
        postprocessing.scene.overrideMaterial =
            postprocessing.materialGodraysGenerate;

        postprocessing.godrayGenUniforms["fStepSize"].value = stepSize;
        postprocessing.godrayGenUniforms["tInput"].value = inputTex;

        renderer.setRenderTarget(renderTarget);
        renderer.render(postprocessing.scene, postprocessing.camera);
        postprocessing.scene.overrideMaterial = null;
    };

    export const onResize = () => {
        const renderTargetWidth = window.innerWidth;
        const renderTargetHeight = window.innerHeight;

        postprocessing.rtTextureColors.setSize(
            renderTargetWidth,
            renderTargetHeight
        );
        postprocessing.rtTextureDepth.setSize(
            renderTargetWidth,
            renderTargetHeight
        );
        postprocessing.rtTextureDepthMask.setSize(
            renderTargetWidth,
            renderTargetHeight
        );

        const adjustedWidth =
            renderTargetWidth * godrayRenderTargetResolutionMultiplier;
        const adjustedHeight =
            renderTargetHeight * godrayRenderTargetResolutionMultiplier;
        postprocessing.rtTextureGodRays1.setSize(adjustedWidth, adjustedHeight);
        postprocessing.rtTextureGodRays2.setSize(adjustedWidth, adjustedHeight);
    };

    export const loop = () => {
        requestAnimationFrame(loop);
        const time = Date.now() / 4000;

        sphereMesh.position.x = orbitRadius * Math.cos(time);
        sphereMesh.position.z = orbitRadius * Math.sin(time) - 100;

        clipPosition.x = sunPosition.x;
        clipPosition.y = sunPosition.y;
        clipPosition.z = sunPosition.z;
        clipPosition.w = 1;

        clipPosition
            .applyMatrix4(camera.matrixWorldInverse)
            .applyMatrix4(camera.projectionMatrix);

        // perspective divide (produce NDC space)

        clipPosition.x /= clipPosition.w;
        clipPosition.y /= clipPosition.w;

        screenSpacePosition.x = (clipPosition.x + 1) / 2; // transform from [-1,1] to [0,1]
        screenSpacePosition.y = (clipPosition.y + 1) / 2; // transform from [-1,1] to [0,1]
        screenSpacePosition.z = clipPosition.z; // needs to stay in clip space for visibilty checks

        // Give it to the god-ray and sun shaders

        postprocessing.godrayGenUniforms["vSunPositionScreenSpace"].value.copy(
            screenSpacePosition
        );
        postprocessing.godraysFakeSunUniforms[
            "vSunPositionScreenSpace"
        ].value.copy(screenSpacePosition);

        // -- Draw sky and sun --

        // Clear colors and depths, will clear to sky color

        renderer.setRenderTarget(postprocessing.rtTextureColors);
        renderer.clear(true, true, false);

        // Sun render. Runs a shader that gives a brightness based on the screen
        // space distance to the sun. Not very efficient, so i make a scissor
        // rectangle around the suns position to avoid rendering surrounding pixels.

        const sunsqH = 0.74 * window.innerHeight; // 0.74 depends on extent of sun from shader
        const sunsqW = 0.74 * window.innerHeight; // both depend on height because sun is aspect-corrected

        screenSpacePosition.x *= window.innerWidth;
        screenSpacePosition.y *= window.innerHeight;

        renderer.setScissor(
            screenSpacePosition.x - sunsqW / 2,
            screenSpacePosition.y - sunsqH / 2,
            sunsqW,
            sunsqH
        );
        renderer.setScissorTest(true);

        postprocessing.godraysFakeSunUniforms["fAspect"].value =
            window.innerWidth / window.innerHeight;

        postprocessing.scene.overrideMaterial =
            postprocessing.materialGodraysFakeSun;
        renderer.setRenderTarget(postprocessing.rtTextureColors);
        renderer.render(postprocessing.scene, postprocessing.camera);

        renderer.setScissorTest(false);

        // -- Draw scene objects --

        // Colors

        scene.overrideMaterial = null;
        renderer.setRenderTarget(postprocessing.rtTextureColors);
        renderer.render(scene, camera);

        // Depth

        scene.overrideMaterial = materialDepth;
        renderer.setRenderTarget(postprocessing.rtTextureDepth);
        renderer.clear();
        renderer.render(scene, camera);

        //

        postprocessing.godrayMaskUniforms["tInput"].value =
            postprocessing.rtTextureDepth.texture;

        postprocessing.scene.overrideMaterial =
            postprocessing.materialGodraysDepthMask;
        renderer.setRenderTarget(postprocessing.rtTextureDepthMask);
        renderer.render(postprocessing.scene, postprocessing.camera);

        // -- Render god-rays --

        // Maximum length of god-rays (in texture space [0,1]X[0,1])

        const filterLen = 1.0;

        // Samples taken by filter

        const TAPS_PER_PASS = 6.0;

        // Pass order could equivalently be 3,2,1 (instead of 1,2,3), which
        // would start with a small filter support and grow to large. however
        // the large-to-small order produces less objectionable aliasing artifacts that
        // appear as a glimmer along the length of the beams

        // pass 1 - render into first ping-pong target
        filterGodRays(
            postprocessing.rtTextureDepthMask.texture,
            postprocessing.rtTextureGodRays2,
            getStepSize(filterLen, TAPS_PER_PASS, 1.0)
        );

        // pass 2 - render into second ping-pong target
        filterGodRays(
            postprocessing.rtTextureGodRays2.texture,
            postprocessing.rtTextureGodRays1,
            getStepSize(filterLen, TAPS_PER_PASS, 2.0)
        );

        // pass 3 - 1st RT
        filterGodRays(
            postprocessing.rtTextureGodRays1.texture,
            postprocessing.rtTextureGodRays2,
            getStepSize(filterLen, TAPS_PER_PASS, 3.0)
        );

        // final pass - composite god-rays onto colors

        postprocessing.godrayCombineUniforms["tColors"].value =
            postprocessing.rtTextureColors.texture;
        postprocessing.godrayCombineUniforms["tGodRays"].value =
            postprocessing.rtTextureGodRays2.texture;

        postprocessing.scene.overrideMaterial =
            postprocessing.materialGodraysCombine;

        renderer.setRenderTarget(null);
        renderer.render(postprocessing.scene, postprocessing.camera);
        postprocessing.scene.overrideMaterial = null;
    };
</script>
