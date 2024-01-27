<script lang="ts">
    import Loader from "../components/Loader.svelte";
    import { tick } from "svelte";
    import Scene5 from "../components/scenes/Scene5.svelte";
    import Socials from "../components/Socials.svelte";
    import GSAP from "../components/GSAP.svelte";
    import ScrollDots from "../components/ScrollDots.svelte";

    let loading = true;
    let scrollY: number = 0;
    let scrolling: any;
    let sections: NodeListOf<HTMLElement>;
    let scene: number = 1;

    const loaded = async (e: CustomEvent<any>) => {
        loading = false;

        await tick(); // wait for DOM updates to be applied

        sections = document.querySelectorAll("section");
    };

    const onScroll = () => {
        sections.forEach((f, i) => {
            if (f.inViewport()) {
                scene = i + 1;
            }
        });

        const scrollPercent =
            (scrolling.scrollTop /
                (scrolling.scrollHeight - scrolling.clientHeight)) *
            100;

        scrollY = scrolling.scrollTop;

        // dispatch
        var event = new CustomEvent("scroll-percent", {
            detail: scrollPercent,
        });

        document.dispatchEvent(event);
    };
</script>

<svelte:head>
    <title>Nestor Orest Plysyuk Hladunko - Full stack developer</title>
    <meta
        name="description"
        property="description"
        content="Portfolio of Nestor Orest Plysyuk Hladunko - Full stack developer"
    />
</svelte:head>

<div bind:this={scrolling} id="scrolling" on:scroll={() => onScroll()}>
    <Loader on:load={async (e) => await loaded(e)} {scrollY} {scene} />

    {#if !loading}
        <div id="three" class="font-bold text-4xl lg:text-6xl relative w-full">
            <section class="gsap-scene1">
                <h1>Hi, I'm Nestor</h1>
                <h2>I live in Amsterdam</h2>
                <ScrollDots {scene}></ScrollDots>
            </section>

            <section class="gsap-scene2">
                <p>I love</p>
                <p>web development</p>
            </section>

            <section>
                <p>I'm obsessed</p>
                <p>with canvas</p>
            </section>

            <section class="gsap-scene4">
                <p>I love</p>
                <p>videogames</p>
            </section>

            <section class="gsap-scene5">
                <Scene5 enabled={scene == 5}></Scene5>
            </section>

            <section class="gsap-scene6">
                <Socials {scene}></Socials>
            </section>
        </div>
        <GSAP></GSAP>
    {/if}
</div>

<style>
    #scrolling {
        position: fixed;
        width: 100%;
        height: 100%;
        bottom: 0;
        top: 0;
        overflow-x: hidden;
        overflow-y: auto;
        overscroll-behavior: none;
        -webkit-overflow-scrolling: touch;
    }

    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        gap: 0.5rem;
        width: 100dvw;
        height: 100dvh;
    }

    .gsap-scene5,
    .gsap-scene6 {
        height: 200dvh;
    }
</style>
