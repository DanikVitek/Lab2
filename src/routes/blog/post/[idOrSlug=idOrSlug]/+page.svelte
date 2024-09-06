<script lang="ts">
	import type { PageData } from './$types';
	import Comment from './Comment.svelte';

	export let data: PageData;

	function rewireRepliesCount<T extends { _count: { replies: number } }>(
		data: T,
	): Omit<T, '_count'> & { repliesCount: number } {
		// @ts-ignore
		data.repliesCount = data._count.replies;
		// @ts-ignore
		data._count = undefined;
		// @ts-ignore
		return data;
	}
</script>

<h1>{data.post.title}</h1>
<div class="metadata">
	<p>By {data.post.author.name}</p>
	<p>Published at {data.post.createdAt.toLocaleString()}</p>
</div>
<div id="post-content">
	{#each data.post.content.split(/(\\r\\n)|\\r|\\n/) as paragraph}
		<p>{paragraph}</p>
	{/each}
</div>

<br />

Comments:

<form action={`/blog/${data.post.id}?/comment`} method="post">
	<textarea name="text" placeholder="Comment" required></textarea>
	<button type="submit">Comment</button>
</form>

<div id="post-comments">
	{#await data.comments}
		<p>Loading...</p>
	{:then comments}
		{#each comments as comment}
			<Comment data={rewireRepliesCount(comment)} />
		{/each}
	{/await}
</div>

<style>
	.metadata {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
