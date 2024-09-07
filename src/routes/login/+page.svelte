<script>
    import { route } from '$lib/ROUTES';
</script>

<form
    class="flex flex-col justify-center h-screen items-center"
    method="post"
    action={route('default /login')}
>
    <label class="input input-bordered flex items-center gap-2">
        Name:
        <input class="grow" type="text" name="name" required />
    </label>
    <button class="btn" type="submit">Login</button>
</form>
