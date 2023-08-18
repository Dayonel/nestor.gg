<script>
    import Three from "./Three.svelte";
    import Loading from "$lib/Loading.svelte";

    let loading = true;
</script>

<svelte:head>
    <title>My portfolio</title>
    <meta
        name="description"
        content="Nestor Orest Plysyuk Hladunko portfolio"
    />
</svelte:head>

<Three on:mount={() => (loading = false)} />

{#if loading}
    <Loading />
{:else}
    <div class="container">
        <h1>Animate on Scroll</h1>
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
        justify-content: center;
        text-align: center;
        width: 100vw;
    }

    section {
        min-height: 100vh;
        padding: 20px;
        font-size: 4vh;
    }
</style>
