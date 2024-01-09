<script>
    import BackgroundText from "$lib/BackgroundText.svelte";
</script>

<div class="section5-wrap"></div>
<div class="scene5-text">
    <BackgroundText
        text="THANK YOU"
        top={window.innerWidth > window.innerHeight ? "15%" : "-50%"}
        left={window.innerWidth > window.innerHeight ? "-50%" : "-85%"}
    ></BackgroundText>
    <BackgroundText
        text="THANK YOU"
        top={window.innerWidth > window.innerHeight ? "10%" : "0"}
        left={window.innerWidth > window.innerHeight ? "-20%" : "-85%"}
        slow
    ></BackgroundText>
    <BackgroundText
        text="THANK YOU"
        top={window.innerWidth > window.innerHeight ? "30%" : "35%"}
        left={window.innerWidth > window.innerHeight ? "0" : "-50%"}
    ></BackgroundText>
    {#if window.innerWidth > 768}
        <BackgroundText
            text="THANK YOU"
            top={window.innerWidth > window.innerHeight ? "35%" : "25%"}
            left={window.innerWidth > window.innerHeight ? "25%" : "50%"}
            slow
        ></BackgroundText>
        <BackgroundText
            text="THANK YOU"
            top={window.innerWidth > window.innerHeight ? "30%" : "0"}
            left={window.innerWidth > window.innerHeight ? "55%" : "50%"}
        ></BackgroundText>
    {/if}
</div>

<style>
    .section5-wrap {
        background-image: url("pagoda.jpg");
        background-size: 100% auto;
        background-repeat: no-repeat;
        border-radius: 8px;
        position: absolute;
        z-index: 1;
        overflow: hidden;
        background-position: 50% 65%;
        width: 90dvw;
        height: 50dvh;
    }

    @media (min-width: 768px) {
        .section5-wrap {
            width: 60dvw;
        }
    }

    .scene5-text {
        opacity: 0;
    }
</style>
