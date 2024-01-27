<script lang="ts">
    import Logo from "$lib/icons/Logo.svelte";
    import { onMount } from "svelte";

    let scrollPercent: number = 0;

    onMount(() => {
        document.addEventListener("scroll-percent", (e: any) => {
            scrollPercent = e.detail;
        });
    });
</script>

<div class="header">
    <header>
        <a class="logo" href="/" aria-label="Go to homepage.">
            <Logo />
        </a>
        <span class="scroll">Scroll progress: {scrollPercent?.toFixed(2)}%</span
        >
    </header>
</div>

<style>
    .header {
        display: flex;
        justify-content: center;
        position: absolute;
        top: 1rem;
        width: 100%;
    }

    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0 1.25rem;
    }

    @media (min-width: 768px) {
        header {
            max-width: 66.66%;
        }
    }

    .logo {
        padding: 10px 12px;
        z-index: 1;
    }

    .logo :global(path) {
        fill: white;
    }

    a {
        display: flex;
    }

    a:hover :global(path) {
        fill: var(--link-hover);
    }

    .scroll {
        font-family: "Handjet";
        font-weight: 700px;
        text-transform: uppercase;
        z-index: 1;
    }
</style>
