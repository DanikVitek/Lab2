<script>
    import "../app.css";
</script>

<nav>
    <a href="/blog">Blog</a>
</nav>

<main>
    <slot />
</main>

<style>
    nav {
        display: flex;
        flex-direction: row;
        gap: 1rem;
    }
    main {
        margin-top: 1rem;
        padding-left: 10vw;
        padding-right: 10vw;
    }
</style>
