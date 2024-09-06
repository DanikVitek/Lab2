import { prisma } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({}) => {
	return {
		posts: await getPosts(),
	};
};

const POSTS_PER_PAGE = 5;

const getPosts = async (page: number = 0) =>
	await prisma.post.findMany({
		select: {
			id: true,
			slug: true,
			title: true,
			createdAt: true,
			author: {
				select: {
					name: true,
				},
			},
		},
		orderBy: { createdAt: 'desc' },
		skip: page * POSTS_PER_PAGE,
		take: POSTS_PER_PAGE,
	});
