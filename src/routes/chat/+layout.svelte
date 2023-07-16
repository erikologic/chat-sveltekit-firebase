<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';
	import type { User } from 'firebase/auth';
	import { onMount } from 'svelte';

	let user: User | null = null;

	onMount(() => {
		auth.onAuthStateChanged((newUser) => {
			if (!newUser) goto('/');
			if (!newUser!.emailVerified) goto('/validate');
			user = newUser as any;
		});
	});
</script>

{#if user}
	<slot />
{/if}
