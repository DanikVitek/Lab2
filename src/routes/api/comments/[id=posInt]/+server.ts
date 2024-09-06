import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server';

export const GET: RequestHandler = async ({ params }) => {
	let id: number;
	try {
		id = Number.parseInt(params.id);
	} catch (e) {
		error(400, { message: `Invalid ID (${e})` });
	}

	const replies = await getRepliesForComment(id);

	return json(replies);
};

const getRepliesForComment = async (commentId: number) =>
	await prisma.comment.findMany({
		select: {
			id: true,
			createdAt: true,
			text: true,
			author: {
				select: {
					id: true,
					name: true,
				},
			},
			_count: {
				select: {
					replies: true,
				},
			},
		},
		where: { parentId: commentId },
		orderBy: { createdAt: 'asc' },
	});
