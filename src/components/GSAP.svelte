<script lang="ts">
    // @ts-ignore
    import { gsap } from "gsap/dist/gsap.js";
    // @ts-ignore
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
    import { onMount } from "svelte";

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        scroll();
        scene1();
        scene2();
        scene3();
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

    const scene1 = () => {
        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: ".gsap-scene2",
                start: "top 66%",
                end: "+=10%",
                scrub: true,
            },
        })
            .to(".gsap-scene1 h1", {
                opacity: 0,
            })
            .to(".gsap-scene1 h2", {
                opacity: 0,
            });
    };

    const scene2 = () => {
        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: ".gsap-scene3",
                start: "top 66%",
                end: "+=10%",
                scrub: true,
            },
        })
            .to(".gsap-scene2 p:first-child", {
                opacity: 0,
            })
            .to(".gsap-scene2 p:last-child", {
                opacity: 0,
            });
    };

    const scene3 = () => {
        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: ".gsap-scene4",
                start: "top 66%",
                end: "+=10%",
                scrub: true,
            },
        })
            .to(".gsap-scene3 p:first-child", {
                opacity: 0,
            })
            .to(".gsap-scene3 p:last-child", {
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
        });

        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: ".gsap-scene5",
                start: "top 25%",
                end: "+=25%",
                scrub: true,
            },
        })
            .to(
                "#threejs",
                {
                    opacity: 0,
                },
                ".gsap-scene5", // at the same time
            )
            .to(
                ".gsap-scene4",
                {
                    opacity: 0,
                },
                ".gsap-scene5", // at the same time
            );
    };

    const scene5 = () => {
        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: ".gsap-scene5",
                start: "top top",
                end: "+=500%", // really slow
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
                end: "+=50%",
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
                start: "top 50%",
                end: "+=50%",
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

    const scene6 = () => {
        gsap.timeline({
            scrollTrigger: {
                scroller: "#scrolling",
                trigger: ".gsap-scene6",
                start: "top top",
                end: "+=25%",
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
                end: "+=25%",
                scrub: true,
            },
        }).to(
            ".gsap-socials",
            {
                opacity: 1,
            },
            ".gsap-scene6", // at the same time
        );
    };
</script>
