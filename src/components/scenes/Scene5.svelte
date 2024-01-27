<script lang="ts">
    import Marquee from "../Marquee.svelte";
    export let enabled: boolean;
</script>

<div class="background" class:hide={!enabled}>
    <div class="marquee">
        <Marquee text="Nestor.gg"></Marquee>
        <Marquee text="Nestor.gg"></Marquee>
        <Marquee text="Nestor.gg"></Marquee>
        <Marquee text="Nestor.gg"></Marquee>
        <Marquee text="Nestor.gg"></Marquee>
        <Marquee text="Nestor.gg"></Marquee>
    </div>
</div>

<style>
    .background {
        opacity: 0;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: -2;
    }

    .marquee {
        width: 300dvw;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transform: rotate(-45deg);
    }
</style>
