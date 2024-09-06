<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<a href="blog/new">Create post</a>

{#each data.posts as post}
	<a class="post-card" href={`/blog/post/${post.slug}`}>
		<h2>{post.title}</h2>
		<div class="metadata">
			<p>By {post.author.name}</p>
			<p>Published at {post.createdAt.toLocaleString()}</p>
		</div>
	</a>
{/each}

<style>
	.post-card {
		display: block;
		padding-left: 1rem;
		padding-right: 1rem;
		border: 2px solid black;
		border-radius: 0.5rem;
		text-decoration: none;
		color: black;
	}
	.post-card > .metadata {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
