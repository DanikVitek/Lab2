import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { route } from '$lib/ROUTES';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const name = cookies.get('name');
	if (name || url.pathname === route('/login')) {
		return { name };
	} else {
		redirect(302, route('/login'));
	}
};
