<script lang="ts">
    import Three from "./Three.svelte";
    import { gsap } from "gsap";
    import { onMount } from "svelte";

    let loading = true;
    let scrollPercent: number = 0;
    let scrollHidden: boolean = false;
    let three: any;

    onMount(() => {
        animate();
    });

    const loaded = () => {
        loading = false;

        three.onscroll = () => {
            scrollPercent =
                (three.scrollTop / (three.scrollHeight - three.clientHeight)) *
                100;

            if (scrollPercent > 1) toggleScroll(true);
            else toggleScroll(false);
        };
    };

    const animate = () => {
        gsap.fromTo(
            "main",
            {
                opacity: 0,
                duration: 1,
                ease: "power1.in",
            },
            {
                opacity: 1,
                duration: 1,
                ease: "power1.in",
            }
        );
    };

    const toggleScroll = (hide: boolean) => {
        if (hide && scrollHidden) return;
        if (!hide && !scrollHidden) return;

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
</script>

<svelte:head>
    <title>Nestor Orest Plysyuk Hladunko - Full stack developer</title>
    <meta
        name="description"
        property="og:description"
        content="Portfolio of Nestor Orest Plysyuk Hladunko - Full stack developer"
    />
</svelte:head>

<Three {scrollPercent} on:mount={() => loaded()} />

<div id="three" class:hide={loading} bind:this={three}>
    {#if !loading}
        <section class="hero">
            <div class="block title">
                <h1 class="name">Nestor Plysyuk</h1>
                <h2 class="position">Software engineer</h2>
            </div>

            <div class="block scroll-dots">
                <span class="dot dot3" />
                <span class="dot dot2" />
                <span class="dot dot1" />
                <span>Scroll down</span>
            </div>
        </section>
        <section>
            <h2>Begin scrolling to see things change</h2>
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
            <p>Now you can scroll back to the top to reverse the animation</p>
        </section>
    {/if}
</div>

<style>
    #three {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overscroll-behavior: none;
    }

    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        min-height: 100dvh;
        padding: 3rem;
    }

    h1 {
        font-size: calc(100% + 6dvw);
    }

    h2,
    p {
        font-size: calc(100% + 2dvw);
    }

    .block {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        margin-top: auto;
    }

    .hero {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .scroll-dots {
        margin-top: auto;
        font-weight: 700;
        font-size: 22px;
    }

    .title {
        padding-bottom: 3rem;
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
</style>
