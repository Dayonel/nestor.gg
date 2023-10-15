<script lang="ts">
    export let progress: number = 0;

    let total = 150;
</script>

<div class="loading">
    <span>Loading...</span>
    <span class="loader" style="width: {total}px">
        <span class="progress" style="width: {(progress * total) / 100}px" />
    </span>
</div>

<style>
    .loading {
        position: fixed;
        z-index: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100dvw;
        height: 100dvh;
        gap: 0.5rem;
    }

    .loader {
        height: 4px;
        background: #393939;
        position: relative;
    }

    .progress {
        height: 4px;
        background-color: white;
        position: absolute;
    }
</style>
