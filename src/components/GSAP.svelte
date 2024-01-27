<script lang="ts">
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    // @ts-ignore
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
    import { onMount } from "svelte";

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        scroll();
        scene4();
        scene5();
        scene6();
    });

    const scroll = () => {
        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: ".gsap-scene1",
                start: "top top",
                end: "+=10%",
                scrub: true,
            },
        }).to(".gsap-dots", {
            opacity: 0,
        });
    };

    const scene4 = () => {
        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: ".gsap-scene4",
                start: "top top",
                end: "+=100%",
                scrub: true,
                pin: ".gsap-scene4",
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
            .to(".gsap-scene4", {
                opacity: 0,
            });
    };

    const scene6 = () => {
        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: ".gsap-scene6",
                start: "top top",
                end: "+=100%",
                scrub: true,
            },
        }).to(
            "#threejs",
            {
                opacity: 1,
            },
            ".gsap-scene6", // at the same time
        );

        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: ".gsap-scene6",
                start: "top top",
                end: "+=100%",
                scrub: true,
            },
        }).to(".gsap-socials", {
            opacity: 1,
        });
    };

    const scene5 = () => {
        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: ".gsap-scene5",
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
            ".gsap-scene5", // at the same time
        );

        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: ".gsap-scene5",
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
                trigger: ".gsap-scene6",
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
