import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma, rewireRepliesCount } from '$lib/server';
import type { CommentData } from '$lib';

export const GET: RequestHandler = async ({ params }) => {
    const id = Number.parseInt(params.id);
    if (Number.isNaN(id)) {
        error(400, { message: `Invalid ID` });
    }

    const replies = await getRepliesForComment(id);

    return json(replies);
};

const getRepliesForComment = async (commentId: number) =>
    await prisma.comment
        .findMany({
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
                    select: {
                        replies: true,
                    },
                },
            },
            where: { parentId: commentId },
            orderBy: { createdAt: 'asc' },
        })
        .then((c) => {
            for (const comment of c) {
                rewireRepliesCount(comment);
            }
            // @ts-ignore
            return c as CommentData[];
        });
