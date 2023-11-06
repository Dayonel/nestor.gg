<script lang="ts">
    export let progress: number;
    export let total: number;
</script>

<div class="loading">
    <span>Loading...</span>
    <span class="progress-bar">
        <span
            class="progress-sliver"
            style="--width: {(progress / total) * 100}%"
        />
    </span>
</div>

<style>
    .loading {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .progress-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 0.5rem;
    }
    .progress-sliver {
        display: flex;
        width: var(--width);
        background-color: #f8485e;
        height: 100%;
    }
</style>
