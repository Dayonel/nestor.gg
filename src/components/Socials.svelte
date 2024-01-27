<script lang="ts">
    import Twitter from "$lib/icons/social/Twitter.svelte";
    import GitHub from "$lib/icons/social/GitHub.svelte";
    import Linkedin from "$lib/icons/social/Linkedin.svelte";
    import Link from "$lib/Link.svelte";
    import SocialsIcon from "$lib/icons/SocialsIcon.svelte";
    export let scene: number;
</script>

<div
    class="fixed flex flex-col gap-5 items-center bottom-8 opacity-0 gsap-socials"
>
    <SocialsIcon></SocialsIcon>
    <div class="flex items-center justify-center gap-2">
        {#if scene == 6}
            <Link
                href="https://github.com/Dayonel"
                text="Grab the code for this project and explore my other contributions by searching for the username Dayonel on GitHub."
            >
                <GitHub></GitHub>
            </Link>
            <Link
                href="https://twitter.com/nestordotgg"
                text="Follow @nestordotgg on twitter."
            >
                <Twitter></Twitter>
            </Link>
            <Link
                href="https://www.linkedin.com/in/nestor-plysyuk"
                text="Connect with me on LinkedIn by searching for my profile, nestor-plysyuk."
            >
                <Linkedin></Linkedin>
            </Link>
        {/if}
    </div>
</div>
