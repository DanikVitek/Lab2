import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createComment, prisma } from '$lib/server';
import { rewireRepliesCount } from '$lib/server';
import type { CommentData } from '$lib';

export const load: PageServerLoad = async ({ params }) => {
	const maybeId = Number.parseInt(params.idOrSlug);
	const idOrSlug: number | string = Number.isNaN(maybeId) ? params.idOrSlug : maybeId;
	return {
		comments: getCommentsForPost(idOrSlug),
		post: (await getPost(idOrSlug)) ?? error(404, { message: 'Post not found' }),
	};
};

const getPost = async (idOrSlug: number | string) =>
	await prisma.post.findUnique({
		select: {
			id: true,
			title: true,
			createdAt: true,
			content: true,
			author: {
				select: {
					id: true,
					name: true,
				},
			},
		},
		where: postWhereIdOrSlug(idOrSlug),
	});

async function getCommentsForPost(idOrSlug: number | string) {
	const comments = await prisma.comment.findMany({
		select: {
			id: true,
			createdAt: true,
			text: true,
			post: { select: { id: true } },
			author: {
				select: {
					id: true,
					name: true,
				},
			},
			_count: {
				select: { replies: true },
			},
		},
		where: {
			post: postWhereIdOrSlug(idOrSlug),
			parentId: null,
		},
		orderBy: { createdAt: 'asc' },
	});
	return comments.map(rewireRepliesCount) as CommentData[];
}

const postWhereIdOrSlug = (idOrSlug: number | string) => ({
	id: typeof idOrSlug === 'number' ? idOrSlug : undefined,
	slug: typeof idOrSlug === 'string' ? idOrSlug : undefined,
});

export const actions = {
	comment: async ({ request, cookies, params }) => {
		const name = cookies.get('name') ?? error(403, 'You must be logged in to comment');

		const data = await request.formData();

		const text = data.get('text') ?? error(400, 'Text is required');
		if (typeof text !== 'string') {
			error(400, 'Text must be a string');
		}

		const maybePostId = Number.parseInt(params.idOrSlug!);
		const postId = !Number.isNaN(maybePostId) ? maybePostId : error(400, 'Invalid post ID');

		await createComment(postId, text, name, null);
	},
	reply: async ({ request, cookies, params }) => {
		const name = cookies.get('name') ?? error(403, 'You must be logged in to comment');

		const data = await request.formData();

		const text = data.get('text') ?? error(400, 'Text is required');
		if (typeof text !== 'string') {
			error(400, 'Text must be a string');
		}

		const parentIdStr = data.get('id') ?? error(400, 'Parent ID is required');
		if (typeof parentIdStr !== 'string') {
			error(400, 'Parent ID must be a number string');
		}
		const parentId = Number.parseInt(parentIdStr);
		if (Number.isNaN(parentId)) {
			error(400, 'Parent ID must be a number string');
		}

		const maybePostId = Number.parseInt(params.idOrSlug!);
		const postId = !Number.isNaN(maybePostId) ? maybePostId : error(400, 'Invalid post ID');

		await createComment(postId, text, name, parentId);
	},
} satisfies Actions;
