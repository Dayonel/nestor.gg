<script lang="ts">
    export let text: string;
</script>

<div class="flex gap-20 h-96">
    <span class="text">{text}</span>
    <span class="text">{text}</span>
    <span class="text">{text}</span>
</div>

<style>
    @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 900;
        src: url('/Roboto-Black.ttf') format('truetype');
    }

    span {
        font-family: "Roboto", sans-serif;
    }

    .text {
        font-size: 300px;
        font-weight: 900;
        color: transparent;
        -webkit-text-stroke: 5px #ff5252;
        text-transform: uppercase;
    }
</style>
