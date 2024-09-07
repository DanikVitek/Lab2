<script lang="ts">
    import type { CommentData } from '$lib';
    import { route } from '$lib/ROUTES';
    import type { PageData } from './$types';
    import Comment from './Comment.svelte';
    import { applyAction, deserialize } from '$app/forms';
    import type { ActionsReturns } from './+page.server';

    export let data: PageData;

    let comments: CommentData[];
    $: comments = [];

    const commentsLoadPromise = data.comments.then((c) => {
        comments = c;
    });

    async function onCommentSubmit(
        e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
    ) {
        const form = e.currentTarget;
        const formData = new FormData(form);

        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
        });

        const result = deserialize<ActionsReturns['comment'], Record<string, unknown>>(
            await response.text(),
        );

        if (result.type === 'success') {
            form.reset();
            await commentsLoadPromise;
            comments.push({
                id: result.data!.id,
                author: result.data!.author,
                post: { id: data.post.id },
                text: formData.get('text')! as string,
                createdAt: result.data!.createdAt,
                repliesCount: 0,
            });
            comments = comments; // force reactivity
        }

        applyAction(result);
    }
</script>

<div class="flex flex-row justify-between">
    <span>By {data.post.author.name}</span>
    <span>Published at <time>{data.post.createdAt.toLocaleString()}</time></span>
</div>

<article id="post-content" class="prose lg:prose-xl text-justify">
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
    on:submit|preventDefault={onCommentSubmit}
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
