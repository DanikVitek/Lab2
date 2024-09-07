// place files you want to import through the `$lib` alias in this folder.
export type CommentData = {
    id: number;
    text: string;
    createdAt: Date;
    post: { id: number };
    author: {
        id: number;
        name: string;
    };
    repliesCount: number;
};
