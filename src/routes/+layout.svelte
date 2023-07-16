<script lang="ts">
	import { auth } from '$lib/firebase';
	import type { User } from 'firebase/auth';
	import { onMount } from 'svelte';

	let user: User | null = null;

	onMount(() => {
		auth.onAuthStateChanged((newUser) => {
			user = newUser as any;
		});
	});
</script>

<nav>
	{#if user}
		<p>Welcome, {user.email}!</p>
		<a href="/chat">Chat</a>
		<button on:click={() => auth.signOut()}>Sign out</button>
	{:else}
		<a href="/">Home</a>
		<a href="/sign-in">Sign in</a>
		<a href="/sign-up">Sign up</a>
	{/if}
</nav>

<slot />
