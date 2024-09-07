<script lang="ts">
	import type { CommentData } from '$lib';
	import { route } from '$lib/ROUTES';
	import type { PageData } from './$types';
	import Comment from './Comment.svelte';

	export let data: PageData;

	let comments: CommentData[];
	$: comments = [];

	const commentsLoadPromise = data.comments.then((c) => {
		comments = c;
	});

	async function onCommentSubmit(
		e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
	) {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		const response = await fetch(
			route('POST /api/blog/post/[id=posInt]/comments', { id: data.post.id }),
			{
				method: form.method,
				body: formData,
			},
		);
		if (response.ok) {
			form.reset();
			await commentsLoadPromise;
			const body = await response.json();
			comments.push({
				id: Number.parseInt(response.headers.get('Location')!),
				author: body.author,
				post: { id: data.post.id },
				text: formData.get('text')! as string,
				createdAt: new Date(body.createdAt),
				repliesCount: 0,
			});
			comments = comments; // force reactivity
		}
	}
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

<form
	class="flex flex-col w-1/2"
	action={route('comment /blog/post/[idOrSlug=idOrSlug]', { idOrSlug: data.post.id })}
	method="post"
	on:submit={onCommentSubmit}
>
	<textarea name="text" placeholder="Comment" required></textarea>
	<button class="btn btn-xs" type="submit">Comment</button>
</form>

<div id="post-comments">
	{#await commentsLoadPromise}
		<span class="loading loading-dots loading-sm"></span>
	{:then}
		{#each comments as comment (comment.id)}
			<Comment data={comment} />
		{/each}
	{/await}
</div>
