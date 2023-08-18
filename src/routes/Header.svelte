<script>
    import Logo from "$lib/logo.svelte";
</script>

<header>
    <a class="logo" href="/" aria-label="Go to homepage.">
        <Logo />
    </a>
</header>

<style>
    header {
        position: fixed;
        z-index: 1;
        left: 1rem;
        top: 1rem;
    }

    @media (min-width: 768px) {
        header {
            left: 20rem;
            top: 1rem;
        }
    }

    .logo {
        display: flex;
        width: fit-content;
        border-radius: 4px;
        padding: 10px 12px;
        background-color: white;
    }
</style>
