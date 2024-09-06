<script lang="ts">
	import { rewireRepliesCount } from '$lib';

	type Comment = {
		id: number;
		text: string;
		createdAt: Date;
		post: { id: number };
		author: {
			id: number;
			name: string;
		};
		repliesCount: number;
	};

	export let data: Comment;

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
				data: Comment[];
		  };

	let repliesLoadState: RepliesLoadState;
	$: repliesLoadState = {
		tag: data.repliesCount === 0 ? RepliesLoadStateTag.NoReplies : RepliesLoadStateTag.NotLoaded,
	};
	console.log(data);

	async function loadReplies() {
		repliesLoadState.tag = RepliesLoadStateTag.Loading;
		const response = await fetch(`/api/comments/${data.id}/replies`);
		const replyData: any[] = await response.json();
		repliesLoadState = {
			tag: RepliesLoadStateTag.LoadedVisible,
			data: replyData.map((data) => {
				const rewired = rewireRepliesCount(data);
				rewired.createdAt = new Date(rewired.createdAt);
				return rewired;
			}) as Comment[],
		};
	}
</script>

<div class="flex flex-col">
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
					{#each repliesLoadState.data as reply}
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
