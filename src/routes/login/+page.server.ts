import { route } from '$lib/ROUTES';
import { error, redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const name = data.get('name') ?? error(400, 'Name is required');
		if (typeof name !== 'string') {
			error(400, 'Name must be a string');
		}
		cookies.set('name', name, { path: '/' });
		redirect(302, route('/blog'));
	},
} satisfies Actions;
