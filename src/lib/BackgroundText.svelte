<script lang="ts">
    export let text: string;
    export let top: string;
    export let left: string;
    export let slow: boolean = false;
    export let reverse: boolean = false;
</script>

<p class="marquee" style="top: {top};left: {left}">
    <span class:slow class:normal={!slow}>{text}&nbsp;</span>
</p>
<p class="marquee marquee2" style="top: {top};left: {left}">
    <span class:slow class:normal={!slow}>{text}&nbsp;</span>
</p>

<style>
    .marquee {
        color: #ff5252;
        font-size: 300px;
        font-weight: 900;
        position: fixed;
        white-space: nowrap;
        overflow: hidden;
        z-index: -1;
        transform: rotate(-45deg);
        margin: 0 auto;
    }

    .marquee span {
        display: inline-block;
        padding-left: 100%;
        will-change: transform;
    }

    .normal {
        animation: marquee 10s linear infinite;
        animation-delay: -5s;
    }

    .slow {
        animation: marquee 15s linear infinite;
        animation-delay: -7.5s;
    }

    .marquee2 span {
        animation-delay: 0s;
    }

    @keyframes marquee {
        0% {
            transform: translate(0, 0);
        }
        100% {
            transform: translate(-100%, 0);
        }
    }
</style>
