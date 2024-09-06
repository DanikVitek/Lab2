<script lang="ts">
	import { rewireRepliesCount } from '$lib';
	import type { PageData } from './$types';
	import Comment from './Comment.svelte';

	export let data: PageData;
</script>

<div class="flex flex-row justify-between">
	<span>By {data.post.author.name}</span>
	<span>Published at <time>{data.post.createdAt.toLocaleString()}</time></span>
</div>
<article id="post-content" class="prose lg:prose-xl">
	<h1>{data.post.title}</h1>
	{#each data.post.content.split(/(\\r\\n)|\\r|\\n/) as paragraph}
		<p>{paragraph}</p>
	{/each}
</article>

<br />

Comments:

<form class="flex flex-col" action={`/blog/${data.post.id}?/comment`} method="post">
	<textarea name="text" placeholder="Comment" required></textarea>
	<button class="btn btn-xs" type="submit">Comment</button>
</form>

<div id="post-comments">
	{#await data.comments}
		<span class="loading loading-dots loading-sm"></span>
	{:then comments}
		{#each comments as comment}
			<Comment data={rewireRepliesCount(comment)} />
		{/each}
	{/await}
</div>
