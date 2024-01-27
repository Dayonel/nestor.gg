<script lang="ts">
    import "./styles.css";
    import "../types/canvas.d.ts";
    import "../types/htmlelement.d.ts";
    import "../app.css";
    import Header from "../components/Header.svelte";
</script>

<Header />

<main>
    <slot />
</main>

<style>
    main {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        top: 0;
        position: fixed;
        overflow-y: auto;
        overscroll-behavior: none;
        -webkit-overflow-scrolling: touch;
    }
</style>
