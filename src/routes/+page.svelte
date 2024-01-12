<script lang="ts">
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    // @ts-ignore
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
    import Loader from "../components/Loader.svelte";
    import { onMount, tick } from "svelte";
    import GitHub from "$lib/GitHub.svelte";
    import Linkedin from "$lib/Linkedin.svelte";
    import Link from "$lib/Link.svelte";
    import Scene5 from "../components/scenes/Scene5.svelte";

    let loading = true;
    let scrollPercent: number = 0;
    let scrollY: number = 0;
    let scrollHidden: boolean = true;
    let scrolling: any;
    let sections: NodeListOf<HTMLElement>;
    let scene: number = 1;

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);
    });

    const loaded = async (e: CustomEvent<any>) => {
        loading = false;

        await tick(); // wait for DOM updates to be applied

        sections = document.querySelectorAll("section");

        gsapSection4();

        gsapSection6();
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
            },
        );
    };

    const gsapSection4 = () => {
        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: "#scene4",
                start: "top top",
                end: "+=100%",
                scrub: true,
                pin: "#scene4",
                pinType: "fixed",
                pinSpacing: false,
            },
        })
            .to("#threejs", {
                opacity: 1,
            })
            .to("#threejs", {
                opacity: 1,
            })
            .to("#threejs", {
                opacity: 0,
            })
            .to("#scene4", {
                opacity: 0,
            });
    };

    const gsapSection6 = () => {
        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: "#scene6",
                start: "top top",
                end: "+=100%",
                scrub: true,
            },
        })
            .to(
                "#threejs",
                {
                    opacity: 1,
                },
                "#scene6", // at the same time
            )
            .to(
                ".socials",
                {
                    opacity: 1,
                },
                "#scene6", // at the same time
            );

        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: "#scene6",
                start: "top top",
                end: "+=100%",
                scrub: true,
            },
        }).to(".scene6-footer", {
            opacity: 1,
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

<div bind:this={scrolling} id="scrolling" on:scroll={() => onScroll()}>
    <Loader
        on:load={async (e) => await loaded(e)}
        {scrollPercent}
        {scrollY}
        {scene}
    />

    {#if !loading}
        <div id="three">
            <!-- Section 1 -->
            <section id="scene1" class="gsap-hero">
                <div class="block">
                    <h1 class="name hero-text">Hi, I'm Nestor</h1>
                    <h2 class="position hero-text">I live in Amsterdam</h2>
                </div>

                {#if scene == 1}
                    <div class="block scroll-dots">
                        <span class="dot dot3" />
                        <span class="dot dot2" />
                        <span class="dot dot1" />
                        <span>Scroll down</span>
                    </div>
                {/if}
            </section>

            <!-- Section 2 -->
            <section id="scene2">
                <p>I love</p>
                <p>web development</p>
            </section>

            <!-- Section 3 -->
            <section id="scene3">
                <p>I'm obsessed</p>
                <p>with canvas</p>
            </section>

            <!-- Section 4 -->
            <section id="scene4">
                <p>I love</p>
                <p>videogames</p>
            </section>

            <!-- Section 5 -->
            <section id="scene5">
                <Scene5 enabled={scene == 5}></Scene5>
            </section>

            <!-- Section 6 -->
            <section id="scene6">
                <div class="scene6-footer">
                    <p>Socials</p>
                    <div class="socials">
                        <Link
                            href="https://github.com/Dayonel"
                            text="Grab the code for this project and explore my other contributions by searching for the username Dayonel on GitHub."
                        >
                            <GitHub></GitHub>
                        </Link>
                        <Link
                            href="https://www.linkedin.com/in/nestor-plysyuk"
                            text="Connect with me on LinkedIn by searching for my profile, nestor-plysyuk."
                        >
                            <Linkedin></Linkedin>
                        </Link>
                    </div>
                </div>
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

    .block {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100dvw;
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

    .socials {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        opacity: 0;
    }

    #scene5,
    #scene6 {
        height: 200dvh;
    }

    .scene6-footer {
        font-family: "Handjet";
        font-weight: 700;
        opacity: 0;
        position: fixed;
        display: flex;
        bottom: 2rem;
        width: 100%;
        align-items: center;
        text-transform: uppercase;
        justify-content: space-between;
        max-width: 66.66%;
    }
</style>
