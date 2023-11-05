<script lang="ts">
    import Three from "../components/Three.svelte";
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    // @ts-ignore
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
    import Loader from "../components/Loader.svelte";
    import { onMount } from "svelte";

    let loading = true;
    let scrollPercent: number = 0;
    let scrollHidden: boolean = true;
    let scrolling: any;
    let totalHeight: number;
    let scrollY: number;
    let sections: any[];
    let models: any[] = [];
    let materials: any[] = [];

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);
        sections = gsap.utils.toArray("#three section");
        totalHeight = sections.length * window.innerHeight;
    });

    const loaded = (e: CustomEvent<any>) => {
        // textReveal();

        loading = false;
        models = e.detail.models;
        materials = e.detail.materials;

        scrolling.onscroll = () => {
            scrollPercent =
                (scrolling.scrollTop /
                    (scrolling.scrollHeight - scrolling.clientHeight)) *
                100;

            scrollY = scrolling.scrollTop;
            if (scrollPercent > 1) toggleScroll(true);
            else toggleScroll(false);
        };
    };

    const toggleScroll = (hide: boolean) => {
        if (hide == scrollHidden) return;

        scrollHidden = hide;
        gsap.fromTo(
            ".scroll-dots",
            {
                opacity: hide ? 1 : 0,
                duration: 0.2,
                ease: "power1.out",
            },
            {
                opacity: hide ? 0 : 1,
                duration: 0.2,
                ease: "power1.out",
            }
        );
    };

    const textReveal = () => {
        const tl = gsap.timeline();

        tl.from(".hero-text", 1.8, {
            y: 100,
            ease: "power4.out",
            delay: 1,
            skewY: 7,
            stagger: {
                amount: 0.3,
            },
        });
    };
</script>

<svelte:head>
    <title>Nestor Orest Plysyuk Hladunko - Full stack developer</title>
    <meta
        name="description"
        property="og:description"
        content="Portfolio of Nestor Orest Plysyuk Hladunko - Full stack developer"
    />
</svelte:head>

<div bind:this={scrolling} id="scrolling">
    {#if loading}
        <Loader on:load={(e) => loaded(e)} />
    {:else}
        <Three {scrollPercent} {models} {materials} />

        <div id="three">
            <section class="hero">
                <div class="block">
                    <div class="line">
                        <h1 class="name hero-text">Hi, I'm Nestor</h1>
                    </div>
                    <div class="line">
                        <h2 class="position hero-text">
                            I live in Amsterdam 🧡
                        </h2>
                    </div>
                </div>

                <div class="block scroll-dots">
                    <span class="dot dot3" />
                    <span class="dot dot2" />
                    <span class="dot dot1" />
                    <span>Scroll down</span>
                </div>
            </section>
            <section class="section2">
                <h2 class="web-development">
                    I am passionate about web development
                </h2>
            </section>
            <section>
                <h2>Changing Objects Position</h2>
                <p>The cubes position is now changing</p>
            </section>

            <section>
                <h2>Changing Objects Rotation</h2>
                <p>The cubes rotation is now changing</p>
            </section>

            <section>
                <h2>Changing Camera Position</h2>
                <p>The camera position is now changing</p>
            </section>

            <section>
                <h2>You are at the bottom</h2>
                <p>The cube will now be auto rotating</p>
                <p>
                    Now you can scroll back to the top to reverse the animation
                </p>
            </section>
        </div>
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

    #three {
        position: relative;
        width: 100%;
    }

    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        width: 100dvw;
        height: 100dvh;
        text-shadow: 0 0 18px var(--background);
    }

    p {
        font-size: calc(50% + 2dvw);
    }

    .block {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100dvw;
    }

    .hero {
        display: flex;
        flex-direction: column;
        justify-content: center;
        /* align-items: center; */
    }

    .line {
        width: 100%;
        height: 40px;
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    @media (min-width: 920px) {
        .line {
            height: 70px;
        }
    }

    .hero-text {
        position: absolute;
        font-size: 2rem;
    }

    @media (min-width: 920px) {
        .hero-text {
            font-size: 4rem;
        }
    }

    .scroll-dots {
        position: fixed;
        bottom: 2rem;
        font-weight: 700;
        font-size: 22px;
    }

    .dot {
        width: 10px;
        height: 10px;
        margin: 3px;
        background-color: var(--ui-01);
        border-radius: 50%;
        opacity: 0;
    }

    .dot1 {
        -webkit-animation: dotsAnimation 2s ease-out 0.6s infinite;
        animation: dotsAnimation 2s ease-out 0.6s infinite;
    }

    .dot2 {
        -webkit-animation: dotsAnimation 2s ease-out 0.4s infinite;
        animation: dotsAnimation 2s ease-out 0.4s infinite;
    }

    .dot3 {
        -webkit-animation: dotsAnimation 2s ease-out 0.2s infinite;
        animation: dotsAnimation 2s ease-out 0.2s infinite;
    }

    @keyframes dotsAnimation {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        80% {
            opacity: 0;
        }
        100% {
            opacity: 0;
        }
    }

    .web-development {
        width: 100%;
    }

    @media (min-width: 920px) {
        .web-development {
            width: 590px;
            font-size: 96px;
        }
    }
</style>
