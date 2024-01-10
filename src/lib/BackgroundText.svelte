<script lang="ts">
    export let text: string;
    export let slow: boolean = false;
    export let reverse: boolean = false;
</script>

<div class="marquee-content">
    <span class="text" class:slow class:reverse>{text}</span>
    <span class="text" class:slow class:reverse>{text}</span>
    <span class="text" class:slow class:reverse>{text}</span>
</div>

<style>
    span {
        font-family: 'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
            "Helvetica Neue", sans-serif;
    }

    .text {
        font-size: 300px;
        font-weight: 900;
        color: transparent;
        -webkit-text-stroke: 15px #ff5252;
        text-transform: uppercase;
    }

    .marquee-content {
        display: flex;
        white-space: nowrap;
    }
</style>
