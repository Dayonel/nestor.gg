<script lang="ts">
    import "./styles.css";
    import Header from "./Header.svelte";
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
        height: 100dvh;
    }
</style>
