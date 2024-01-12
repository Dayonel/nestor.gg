<script lang="ts">
    import BackgroundText from "$lib/BackgroundText.svelte";
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    import { onMount } from "svelte";

    export let enabled: boolean;

    onMount(() => marquee());

    const marquee = () => {
        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: "#scene5",
                start: "top top",
                end: "+=600%", // really slow
                scrub: true,
            },
        }).to(
            ".text",
            {
                xPercent: -100,
                ease: "linear",
            },
            "#scene5", // at the same time
        );

        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: "#scene5",
                start: "top top",
                end: "+=100%",
                scrub: true,
            },
        }).to(
            ".background",
            {
                opacity: 1,
            },
            "#scene5", // at the same time
        );

        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: "#scene6",
                start: "top bottom",
                end: "+=100%", // really slow
                scrub: true,
            },
        })
            .to(".text", {
                opacity: 1,
            })
            .to(".text", {
                opacity: 0,
            });
    };
</script>

<div class="background" class:hide={!enabled}>
    <div class="marquee">
        <BackgroundText text="Nestor.gg"></BackgroundText>
        <BackgroundText text="Nestor.gg"></BackgroundText>
        <BackgroundText text="Nestor.gg"></BackgroundText>
        <BackgroundText text="Nestor.gg"></BackgroundText>
        <BackgroundText text="Nestor.gg"></BackgroundText>
    </div>
</div>

<style>
    .background {
        opacity: 0;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: -2;
    }

    .marquee {
        width: 200dvw;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transform: rotate(-45deg);
    }
</style>
