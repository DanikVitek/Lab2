<script lang="ts">
	import type { CommentData } from '$lib';

	export let data: CommentData;

	enum RepliesLoadStateTag {
		NoReplies,
		NotLoaded,
		Loading,
		LoadedVisible,
		LoadedHidden,
	}

	type RepliesLoadState =
		| {
				tag:
					| RepliesLoadStateTag.NoReplies
					| RepliesLoadStateTag.NotLoaded
					| RepliesLoadStateTag.Loading;
		  }
		| {
				tag: RepliesLoadStateTag.LoadedVisible | RepliesLoadStateTag.LoadedHidden;
				data: CommentData[];
		  };

	let repliesLoadState: RepliesLoadState;
	$: repliesLoadState = {
		tag: data.repliesCount === 0 ? RepliesLoadStateTag.NoReplies : RepliesLoadStateTag.NotLoaded,
	};

	async function loadReplies() {
		repliesLoadState.tag = RepliesLoadStateTag.Loading;
		const response = await fetch(`/api/comments/${data.id}/replies`);
		const replyData: CommentData[] = await response.json().then((data) => {
			for (let i = 0; i < data.length; i++) {
				data[i].createdAt = new Date(data[i].createdAt);
			}
			return data;
		});
		repliesLoadState = {
			tag: RepliesLoadStateTag.LoadedVisible,
			data: replyData as CommentData[],
		};
	}
</script>

<div class="flex flex-col w-1/2">
	<div class="chat chat-start">
		<div class="chat-header">
			{data.author.name}
			<time class="text-xs opacity-50">{data.createdAt.toLocaleString()}</time>
		</div>
		<div class="chat-bubble">{data.text}</div>
	</div>

	<form class="flex flex-col" method="post" action="/blog/post/{data.post.id}?/reply">
		<input name="id" type="hidden" value={data.id} />
		<textarea name="text" placeholder="Reply"></textarea>
		<button class="btn btn-xs">Reply</button>
	</form>

	{#if repliesLoadState.tag !== RepliesLoadStateTag.NoReplies}
		<div class="flex flex-col">
			{#if repliesLoadState.tag === RepliesLoadStateTag.NotLoaded}
				<button on:click={() => loadReplies()}>Replies:</button>
			{:else if repliesLoadState.tag === RepliesLoadStateTag.Loading}
				<button>Replies:</button>

				<span class="ml-5 loading loading-dots loading-sm"></span>
			{:else if repliesLoadState.tag === RepliesLoadStateTag.LoadedVisible}
				<button on:click={() => (repliesLoadState.tag = RepliesLoadStateTag.LoadedHidden)}>
					Replies:
				</button>

				<div class="ml-5">
					{#each repliesLoadState.data as reply (reply.id)}
						<svelte:self data={reply} />
					{/each}
				</div>
			{:else if repliesLoadState.tag === RepliesLoadStateTag.LoadedHidden}
				<button on:click={() => (repliesLoadState.tag = RepliesLoadStateTag.LoadedVisible)}>
					Replies:
				</button>
			{/if}
		</div>
	{/if}
</div>
