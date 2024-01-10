<script lang="ts">
    import BackgroundText from "$lib/BackgroundText.svelte";
    import { onMount } from "svelte";
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";

    onMount(() => marquee());

    const marquee = () => {
        gsap.to(".text", {
            xPercent: -100,
            repeat: -1,
            duration: 10,
            ease: "linear",
        }).totalProgress(0.5);
    };
</script>

<div class="scene5-text">
    <div class="marquee">
        <BackgroundText text="Thank you"></BackgroundText>
        <BackgroundText slow reverse text="Thank you"></BackgroundText>
        <BackgroundText text="Thank you"></BackgroundText>
        <BackgroundText slow reverse text="Thank you"></BackgroundText>
        <BackgroundText text="Thank you"></BackgroundText>
    </div>
</div>

<style>
    .scene5-text {
        opacity: 0;
    }

    .marquee {
        width: 200dvw;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transform: rotate(-45deg);
    }
</style>
