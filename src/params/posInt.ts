export const match = (s: number): boolean => {
	const n = Number.parseInt(s as unknown as string);
	return !Number.isNaN(n) && n > 0;
};
