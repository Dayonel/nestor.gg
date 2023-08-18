<script lang="ts">
    import Three from "./Three.svelte";
    import Loading from "$lib/Loading.svelte";

    let loading = true;
    let scrollPercent: number = 0;
</script>

<svelte:head>
    <title>My portfolio</title>
    <meta
        property="og:description"
        content="Portfolio of Nestor Orest Plysyuk Hladunko - Full stack developer"
    />
</svelte:head>

<Three bind:scrollPercent on:mount={() => (loading = false)} />

{#if loading}
    <Loading />
{:else}
    <div class="container">
        <section class="hero">
            <div class="block title">
                <h1>Nestor Orest Plysyuk</h1>
                <h2>Software engineer</h2>
            </div>

            {#if scrollPercent < 1}
                <div class="block scroll">
                    <span class="dot dot3" />
                    <span class="dot dot2" />
                    <span class="dot dot1" />
                    <span>Scroll down</span>
                </div>
            {/if}
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
    </div>
{/if}

<style>
    .container {
        position: absolute;
        text-align: center;
        width: 100%;
        height: 100%;
    }

    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        min-height: 100vh;
        padding: 3rem;
        font-size: 4vw;
    }

    h2 {
        font-size: 3vw;
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

    .scroll {
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
