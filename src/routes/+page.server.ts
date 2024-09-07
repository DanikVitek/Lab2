import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { route } from '$lib/ROUTES';

export const load: PageServerLoad = async ({}) => {
	redirect(302, route('/blog'));
};
