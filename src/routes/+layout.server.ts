import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const name = cookies.get('name');
	if (name || url.pathname === '/login') {
		return { name };
	} else {
		redirect(302, '/login');
	}
};
