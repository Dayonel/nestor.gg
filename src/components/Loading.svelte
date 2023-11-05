<script lang="ts">
    export let progress: number;
    export let total: number;
</script>

<div class="loading">
    <span>Loading...</span>
    <span class="loader bar">
        <span class="progress bar" style="width: {(progress / total) * 100}%" />
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
        background: #393939;
        position: relative;
        width: 150px;
    }

    .progress {
        background-color: white;
        position: absolute;
    }

    .bar {
        height: 2.5rem;
        /* transition: all 0.25s; */
    }
</style>
