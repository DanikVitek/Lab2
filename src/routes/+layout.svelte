<script>
	import { route } from '$lib/ROUTES';
	import '../app.css';
</script>

<nav class="navbar">
	<a class="link" href={route('/blog')}>Blog</a>
</nav>

<main class="mt-4 px-[10vw]">
	<slot />
</main>
