<script lang="ts">
    import { route } from '$lib/ROUTES';
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<a class="btn" href={route('/blog/new')}>Create post</a>

{#each data.posts as post (post.id)}
    <a
        class="card shadow-xl"
        href={route('/blog/post/[idOrSlug=idOrSlug]', { idOrSlug: post.slug })}
    >
        <div class="card-body">
            <h2 class="card-title">{post.title}</h2>
            <div class="flex flex-row justify-between">
                <span>By {post.author.name}</span>
                <span>Published at {post.createdAt.toLocaleString()}</span>
            </div>
        </div>
    </a>
{/each}
