<script lang="ts">
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
    let sections: NodeListOf<HTMLElement>;
    let scene: number = 1;
    let section2AnimComplete = false;

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);
    });

    const loaded = async (e: CustomEvent<any>) => {
        // textReveal();

        loading = false;

        await tick(); // wait for DOM updates to be applied

        sections = document.querySelectorAll("section");

        // gsapSection2();
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
        gsap.timeline({
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
                    if (window.innerWidth < 1600) return;

                    const backwards = self.direction === -1;
                    if (backwards) section2AnimComplete = false;
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

                <div class="block scroll-dots">
                    <span class="dot dot3" />
                    <span class="dot dot2" />
                    <span class="dot dot1" />
                    <span>Scroll down</span>
                </div>
            </section>

            <!-- Section 2 -->
            <section id="scene2">
                <p>I love</p>
                <p>web development</p>
            </section>

            <section id="scene3">
                <p>I enjoy</p>
                <p>playing videogames</p>
            </section>

            <section id="scene4">
                <p>I'm obsessed</p>
                <p>with canvas</p>
            </section>

            <section id="scene5">
                <h2>I'm a big fan of</h2>
                <p>Lineage 2</p>
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
</style>
