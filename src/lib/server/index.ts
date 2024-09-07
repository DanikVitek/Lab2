import { PrismaClient } from '@prisma/client';
import { error, redirect, type Cookies } from '@sveltejs/kit';

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

/**
 * @param cookies cookies from the request
 * @returns the name of the user from the cookies
 * @throws 403 if the user is not logged in
 */
export function getUserName(cookies: Cookies): string {
    return cookies.get('name') ?? error(403, 'You must be logged in');
}
