<script lang="ts">
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    // @ts-ignore
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
    import * as THREE from "three";
    import { createEventDispatcher, onMount } from "svelte";
    import TWEEN from "@tweenjs/tween.js";

    export let models: any[] = [];
    export let animations: any[] = [];
    export let renderer: THREE.WebGLRenderer;
    export let enabled: boolean;

    $: enabled, loop();
    $: enabled, tone();
    $: enabled, resize();
    $: enabled, loadModel();
    $: enabled, introAnimation();
    $: models, loadModel();
    $: models, introAnimation();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.001,
        1000,
    );
    camera.position.set(0, 3, 8);
    scene.add(camera);
    scene.userData.camera = camera;
    scene.userData.scene = 5;

    const dispatch = createEventDispatcher();

    let mounted = false;
    let mixer: THREE.AnimationMixer;
    let active: THREE.AnimationAction;
    let last: THREE.AnimationAction;
    let introCompleted: boolean;
    let baium: any;
    const clock = new THREE.Clock();
    let loadedAnimations: any[] = [];

    onMount(() => init());

    const init = () => {
        gsap.registerPlugin(ScrollTrigger);

        setupLighting();

        renderer.compile(scene, camera);

        mounted = true;

        dispatch("mount", { scene });

        loop();
    };

    const setupLighting = () => {
        // light
        const intensity = 3;
        const skyColor = 0xb1e1ff; // light blue
        const groundColor = 0xb97a20; // brownish orange
        const light = new THREE.HemisphereLight(
            skyColor,
            groundColor,
            intensity,
        );
        scene.add(light);
    };

    const loadModel = () => {
        if (!enabled) return;
        if (!models || models.length < 7) return;

        baium = models[5];
        baium.position.y = 20;
        scene.add(baium);

        // animations
        mixer = new THREE.AnimationMixer(baium);
        animations.forEach((f) => {
            const action = mixer.clipAction(f);
            loadedAnimations.push(action);
        });

        // play
        playAnimation(loadedAnimations[0], true);
        mixer.addEventListener("finished", () =>
            playAnimation(loadedAnimations[1]),
        );
    };

    const introAnimation = () => {
        if (!enabled) return;
        if (!baium) return;

        new TWEEN.Tween(baium.position)
            .interpolation(TWEEN.Interpolation.Bezier)
            .to({ x: 0, y: 0, z: 0 }, 1250)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start()
            .onComplete(() => {
                new TWEEN.Tween(camera.position)
                    .interpolation(TWEEN.Interpolation.Bezier)
                    .to({ x: 0, y: 1.75, z: 5 }, 500)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .onComplete(() => (introCompleted = true))
                    .start();
            });
    };

    const playAnimation = (toAction: THREE.AnimationAction, once?: boolean) => {
        if (toAction == active) return;

        if (once) {
            toAction.setLoop(THREE.LoopOnce);
            toAction.clampWhenFinished = true;
        }

        active = toAction;
        last = active;
        last.fadeOut(1);
        active.reset();
        active.fadeIn(1);
        active.play();
    };

    const tone = () => {
        if (!enabled) return;

        scene.background = new THREE.Color(0x393939);
    };

    const resize = () => {
        if (!enabled) return;

        renderer.domElement.resize(renderer, camera);
    };

    const loop = () => {
        if (!enabled) return;

        requestAnimationFrame(loop);

        if (!introCompleted) TWEEN.update(); // update animations
        if (mixer) mixer.update(clock.getDelta());
    };
</script>

<svelte:window
    on:resize={() => resize()}
    on:orientationchange={() => resize()}
/>
