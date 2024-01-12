<script lang="ts">
    export let text: string;
</script>

<div class="marquee-content">
    <span class="text">{text}</span>
    <span class="text">{text}</span>
    <span class="text">{text}</span>
</div>

<style>
    span {
        font-family: "Roboto";
    }

    .text {
        font-size: 300px;
        font-weight: 900;
        color: transparent;
        -webkit-text-stroke: 5px #ff5252;
        text-transform: uppercase;
    }

    .marquee-content {
        display: flex;
        gap: 5rem;
        white-space: nowrap;
    }
</style>
