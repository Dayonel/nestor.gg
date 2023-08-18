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
    }

    .emoji {
        font-size: calc(6vh + 6vw);
    }
</style>
