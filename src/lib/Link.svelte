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
        width: 36px;
        height: 36px;
        stroke: white;
    }

    a:hover :global(svg) {
        stroke: var(--link-hover);
    }
</style>
