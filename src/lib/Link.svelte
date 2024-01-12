<script lang="ts">
    export let href: string;
    export let text: string;
</script>

<a {href} target="_blank" class="link" rel="noopener noreferrer">
    <span class="sr-only">{text}</span>
    <slot />
</a>

<style>
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }

    .link :global(svg) {
        width: 48px;
        height: 48px;
        fill: white;
    }

    a:hover :global(svg) {
        fill: rgb(224, 204, 250);
    }
</style>
