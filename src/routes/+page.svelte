<script lang="ts">
    import Three from "../components/Three.svelte";
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    // @ts-ignore
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
    import Loader from "../components/Loader.svelte";
    import { onMount, tick } from "svelte";

    let loading = true;
    let scrollPercent: number = 0;
    let scrollY: number = 0;
    let scrollHidden: boolean = true;
    let scrolling: any;
    let models: any[] = [];
    let hdris: any[] = [];
    let textures: any[] = [];
    let sections: NodeListOf<HTMLElement>;
    let scene: number = 1;
    let section2AnimComplete = false;
    let section2AnimBackwards = false;

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);
    });

    const loaded = async (e: CustomEvent<any>) => {
        // textReveal();

        loading = false;
        models = e.detail.models;
        hdris = e.detail.hdris;
        textures = e.detail.textures;

        await tick(); // wait for DOM updates to be applied

        sections = document.querySelectorAll("section");

        gsapSection2();
    };

    const onScroll = () => {
        sections.forEach((f) => {
            if (isInViewport(f)) {
                const id = f.getAttribute("id");
                if (!id) return;

                const text = id.replace("scene", "");
                scene = +text;
            }
        });

        scrollPercent =
            (scrolling.scrollTop /
                (scrolling.scrollHeight - scrolling.clientHeight)) *
            100;

        scrollY = scrolling.scrollTop;
        if (scrollPercent > 1) toggleScroll(true);
        else toggleScroll(false);
    };

    const isInViewport = (element: HTMLElement) => {
        var rect = element.getBoundingClientRect();

        var verticalInView = rect.top <= 0 && rect.bottom >= 0;
        var horizontalInView = rect.left <= 0 && rect.right >= 0;

        return verticalInView && horizontalInView;
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

    const gsapSection2 = () => {
        const t1 = gsap.timeline({
            scrollTrigger: {
                pin: "#scene2",
                pinType: "fixed",
                end: "+=200%",
                scroller: "#scrolling",
            },
        });

        const t2 = gsap.timeline({
            scrollTrigger: {
                trigger: "#scene2",
                start: "top top",
                end: "+=50%",
                scroller: "#scrolling",
                scrub: true,
                onUpdate: (self: any) => {
                    section2AnimBackwards = self.direction === -1;
                    if (window.innerWidth >= 1600 && section2AnimBackwards) {
                        section2AnimComplete = false;
                    }
                },
            },
        });

        let mm = gsap.matchMedia();
        mm.add("(min-width: 1600px)", () => {
            t2.to(".scene2-text", {
                x: "-50%",
                onComplete: () => {
                    section2AnimComplete = true;
                },
            });
        });
    };

    $: if (window.innerWidth < 1600) {
        section2AnimComplete = true;
    }
</script>

<svelte:head>
    <title>Nestor Orest Plysyuk Hladunko - Full stack developer</title>
    <meta
        name="description"
        property="og:description"
        content="Portfolio of Nestor Orest Plysyuk Hladunko - Full stack developer"
    />
</svelte:head>

<div bind:this={scrolling} id="scrolling" on:scroll={() => onScroll()}>
    {#if loading}
        <Loader on:load={async (e) => await loaded(e)} />
    {:else}
        <Three
            {scrollPercent}
            {scrollY}
            {models}
            {hdris}
            {textures}
            {scene}
            {section2AnimComplete}
            {section2AnimBackwards}
        />

        <div id="three">
            <!-- Section 1 -->
            <section id="scene1" class="gsap-hero">
                <div class="block">
                    <h1 class="name hero-text">Hi, I'm Nestor</h1>
                    <h2 class="position hero-text">I live in Amsterdam</h2>
                </div>

                <div class="block scroll-dots">
                    <span class="dot dot3" />
                    <span class="dot dot2" />
                    <span class="dot dot1" />
                    <span>Scroll down</span>
                </div>
            </section>

            <!-- Section 2 -->
            <section id="scene2">
                <p class="scene2-text">
                    I'm on an epic quest to master the art of web development
                </p>
            </section>
            <!-- <div class="container"> -->

            <!-- <ul>
                    {#each new Array(10).keys() as _}
                        <li>
                            <figure>
                                <img
                                    src="logos/svelte-logo.png"
                                    alt="Svelte logo"
                                />
                            </figure>
                            <div class="tech-container">
                                <span class="tech">Svelte</span>
                                <span class="tech tech-reveal">Svelte</span>
                            </div>
                        </li>
                    {/each}
                </ul> -->
            <!-- </div> -->

            <section id="scene3">
                <p>I love</p>
                <p>videogames</p>
            </section>

            <section id="scene4">
                <p>I love</p>
                <p>videogames</p>
            </section>

            <section id="scene5">
                <h2>Changing Camera Position</h2>
                <p>The camera position is now changing</p>
            </section>

            <section id="scene6">
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
    }

    @media (max-width: 1599px) {
        .scene2-text {
            top: calc(25% - 3.5rem);
            position: absolute;
        }
    }

    @media (min-width: 920px) {
        .scene2-text {
            top: calc(25% - 8rem);
        }
    }

    .block {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100dvw;
    }

    img {
        display: block;
        max-width: 100%;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scale(1.05);
        transition: transform 0.4s cubic-bezier(0.55, 0, 0.1, 1);
    }

    li:hover img {
        transform: scale(1);
    }

    li:hover span {
        transform: translateY(-100%);
    }

    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    ul {
        list-style: none;
        display: grid;
        justify-content: center;
        grid-gap: 2.5rem;
        grid-template-columns: 1fr;
    }

    @media (min-width: 768px) {
        ul {
            grid-template-columns: 1fr 1fr;
            padding: 0 80px;
            max-width: 1400px;
        }
    }

    li {
        cursor: pointer;
        padding: 0 20px;
    }

    @media (min-width: 768px) {
        li {
            padding: 0;
        }
    }

    figure {
        overflow: hidden;
    }

    .tech-container {
        position: relative;
        overflow: hidden;
        margin-top: 0.5rem;
    }

    @media (min-width: 768px) {
        .tech-container {
            margin-bottom: 2rem;
        }
    }

    .tech {
        font-size: 1.25rem;
        display: block;
        transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
    }

    .tech-reveal {
        position: absolute;
        top: 100%;
        left: 0;
    }

    h1,
    h2,
    p {
        font-size: 2rem;
        max-width: 305px;
    }

    @media (min-width: 920px) {
        h1,
        h2,
        p {
            font-size: 4rem;
            max-width: 610px;
        }
    }

    p {
        font-weight: bold;
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
</style>
