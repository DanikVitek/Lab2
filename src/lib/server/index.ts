import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export function rewireRepliesCount<T extends { _count: { replies: number } }>(
	data: T,
): Omit<T, '_count'> & { repliesCount: number } {
	// @ts-ignore
	data.repliesCount = data._count.replies;
	// @ts-ignore
	data._count = undefined;
	// @ts-ignore
	return data;
}

export async function createComment(
	postId: number,
	text: string,
	name: string,
	parentId: number | null,
) {
	return await prisma.comment.create({
		data: {
			text,
			post: { connect: { id: postId } },
			author: {
				connectOrCreate: {
					where: { name },
					create: { name },
				},
			},
			parent: parentId ? { connect: { id: parentId } } : undefined,
		},
		select: {
			id: true,
			author: { select: { id: true } },
			createdAt: true,
		},
	});
}
