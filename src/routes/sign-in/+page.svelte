<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';
	import {
		GoogleAuthProvider,
		getAuth,
		signInWithEmailAndPassword,
		signInWithPopup
	} from 'firebase/auth';

	let errorMessage: string;

	function handleSubmit(event: Event) {
		event.preventDefault();
		const email = (event.target as HTMLFormElement)?.email?.value;
		const password = (event.target as HTMLFormElement)?.password?.value;
		signInWithEmailAndPassword(auth, email, password)
			.then(async ({ user }) => {
				if (!user.emailVerified) {
					await auth.signOut();
					goto('/validate').catch(console.error);
				} else {
					goto('/').catch(console.error);
				}
			})
			.catch((err) => {
				if (err?.code) errorMessage = 'Invalid email or password'; // TODO improve this error message
			});
	}

	const googleAuthProvider = new GoogleAuthProvider();
	function handleContinueWithGoogle(event: Event) {
		signInWithPopup(getAuth(), googleAuthProvider).then(async () => {
			goto('/').catch(console.error);
		});
	}
</script>

<h1>Login</h1>
<form on:submit={handleSubmit}>
	<label for="email">Email</label>
	<input type="email" id="email" name="email" placeholder="Email" />
	<label for="password">Password</label>
	<input type="password" id="password" name="password" placeholder="Password" />
	<button type="submit">Login</button>
</form>

{#if errorMessage}
	<output>{errorMessage}</output>
{/if}

<button type="button" on:click={handleContinueWithGoogle}>Sign in with Google</button>
