<script lang="ts">
	type Comment = {
		id: number;
		text: string;
		createdAt: Date;
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

	async function loadReplies() {
		repliesLoadState.tag = RepliesLoadStateTag.Loading;
		const response = await fetch(`/api/comments/${data.id}/replies`);
		const replyData = await response.json();
		repliesLoadState = {
			tag: RepliesLoadStateTag.LoadedVisible,
			data: replyData,
		};
	}
</script>

<div>
	<div class="metadata">
		<p>By {data.author.name}</p>
		<p>Published at {data.createdAt.toLocaleString()}</p>
	</div>
	<p>{data.text}</p>
	{#if repliesLoadState.tag !== RepliesLoadStateTag.NoReplies}
		{#if repliesLoadState.tag === RepliesLoadStateTag.NotLoaded}
			<button on:click={() => loadReplies()}>Replies:</button>
		{:else if repliesLoadState.tag === RepliesLoadStateTag.Loading}
			<button>Replies:</button>
			<div id="replies">
				<p>Loading...</p>
			</div>
		{:else if repliesLoadState.tag === RepliesLoadStateTag.LoadedVisible}
			<button on:click={() => (repliesLoadState.tag = RepliesLoadStateTag.LoadedHidden)}>
				Replies:
			</button>
			<div id="replies">
				{#each repliesLoadState.data as reply}
					<svelte:self data={reply} />
				{/each}
			</div>
		{:else if repliesLoadState.tag === RepliesLoadStateTag.LoadedHidden}
			<button on:click={() => (repliesLoadState.tag = RepliesLoadStateTag.LoadedVisible)}>
				Replies:
			</button>
		{/if}
	{/if}
</div>

<style>
	.metadata {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.replies {
		margin-left: 1rem;
	}
</style>
