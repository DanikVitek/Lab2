<script>
	import { route } from '$lib/ROUTES';
</script>

<form method="post" action={route('default /blog/new')}>
	<label>
		Title
		<input name="title" type="text" />
	</label>
	<label>
		Content
		<textarea name="content"></textarea>
	</label>
	<button type="submit">Create post</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	input,
	textarea {
		padding: 0.5rem;
	}
	textarea {
		resize: vertical;
	}
	button {
		padding: 0.5rem;
	}
</style>
