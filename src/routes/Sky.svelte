<script lang="ts">
    import { onMount } from "svelte";
    // @ts-ignore
    import * as THREE from "three";

    export let scene: THREE.Scene;
    export let renderer: THREE.WebGLRenderer;
    export let envMap: any;

    onMount(async () => {
        await init();
    });

    const init = async () => {
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.3;

        THREE.ShaderChunk.tonemapping_pars_fragment =
            THREE.ShaderChunk.tonemapping_pars_fragment.replace(
                "vec3 CustomToneMapping( vec3 color ) { return color; }",

                `#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )

        			float toneMappingWhitePoint = 1.0;

        			vec3 CustomToneMapping( vec3 color ) {
        				color *= toneMappingExposure;
        				return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );

        			}`
            );

        scene.backgroundBlurriness = 0.3;
        scene.backgroundIntensity = 5;
        const ambient = new THREE.AmbientLight(0xd8e9f8, 7.5);
        scene.add(ambient);

        scene.background = envMap;
        scene.environment = envMap;

        renderer.outputColorSpace = THREE.SRGBColorSpace;
    };
</script>
