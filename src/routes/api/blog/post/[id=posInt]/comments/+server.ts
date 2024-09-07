import { error, json, type RequestHandler } from '@sveltejs/kit';
import { createComment } from '$lib/server';

export const POST: RequestHandler = async ({ request, cookies, params }) => {
	const name = cookies.get('name') ?? error(403, 'You must be logged in to comment');

	const data = await request.formData();

	const text = data.get('text') ?? error(400, 'Text is required');
	if (typeof text !== 'string') {
		error(400, 'Text must be a string');
	}

	const maybePostId = Number.parseInt(params.id!);
	const postId = !Number.isNaN(maybePostId) ? maybePostId : error(400, 'Invalid post ID');

	const {
		id,
		author: { id: authorId },
		createdAt,
	} = await createComment(postId, text, name, null);

	return json(
		{ author: { id: authorId, name }, createdAt },
		{ status: 200, headers: { Location: id.toString() } },
	);
};
