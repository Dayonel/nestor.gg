<script lang="ts">
    import { page } from "$app/stores";
</script>

<div class="error">
    <span class="emoji">¯\_(ツ)_/¯</span>
    <span>{$page.error?.message?.toLowerCase() ?? "nope"}</span>
</div>

<style>
    .error {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
            sans-serif;
    }

    .emoji {
        font-size: calc(6vh + 6vw);
    }
</style>
