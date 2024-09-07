import { route } from '$lib/ROUTES';
import { prisma } from '$lib/server';
import { error, redirect, type Actions } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, cookies }) => {
        const name = cookies.get('name') ?? redirect(302, route('/login'));

        const data = await request.formData();

        const title = data.get('title') ?? error(400, 'Title is required');
        if (typeof title !== 'string') {
            error(400, 'Title must be a string');
        }

        const content = data.get('content') ?? error(400, 'Content is required');
        if (typeof content !== 'string') {
            error(400, 'Content must be a string');
        }

        const slug = await createPost(title, content, name);
        redirect(302, route('/blog/post/[idOrSlug=idOrSlug]', { idOrSlug: slug }));
    },
} satisfies Actions;

async function createPost(title: string, content: string, name: string) {
    const slug = title.toLowerCase().replace(/[^a-z0-9\-]+/g, '-');
    await prisma.post.create({
        select: { id: true },
        data: {
            title,
            slug,
            content,
            author: {
                connectOrCreate: {
                    where: { name },
                    create: { name },
                },
            },
        },
    });
    return slug;
}
