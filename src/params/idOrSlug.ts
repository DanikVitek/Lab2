export const match = (s: number | string): boolean => {
	const n = Number.parseInt(s as unknown as string);
	return (!Number.isNaN(n) && n > 0) || /^[0-9a-z\-]+$/.test(s as string);
};
