// place files you want to import through the `$lib` alias in this folder.
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
