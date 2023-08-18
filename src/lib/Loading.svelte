<div class="loading">
    <span>Loading...</span>
    <span class="loader" />
</div>

<style>
    .loading {
        position: fixed;
        z-index: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
        gap: 0.5rem;
    }

    .loader {
        width: 96px;
        height: 24px;
        display: inline-block;
        background-color: #fff;
        border: 1px solid #fff;
        border-radius: 4px;
        background: linear-gradient(
                45deg,
                transparent 49%,
                #fff 50%,
                #fff 50%,
                transparent 51%,
                transparent
            ),
            linear-gradient(
                -45deg,
                transparent 49%,
                #fff 50%,
                #fff 50%,
                transparent 51%,
                transparent
            );
        font-size: 15px;
        background-size: 1em 1em;
        box-sizing: border-box;
        animation: barStripe 0.6s linear infinite;
    }

    @keyframes barStripe {
        0% {
            background-position: 1em 0;
        }
        100% {
            background-position: 0 0;
        }
    }
</style>
