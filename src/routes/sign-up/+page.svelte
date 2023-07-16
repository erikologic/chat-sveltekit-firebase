<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';
	import {
		GoogleAuthProvider,
		getAuth,
		sendEmailVerification,
		signInWithPopup
	} from 'firebase/auth';

	function handleSubmit(event: Event) {
		event.preventDefault();
		const email = (event.target as HTMLFormElement)?.email?.value;
		const password = (event.target as HTMLFormElement)?.password?.value;

		auth
			.createUserWithEmailAndPassword(email, password)
			.then(async ({ user }) => {
				if (!user!.emailVerified) {
					await sendEmailVerification(user!); //TODO: check if user.user is null
					await auth.signOut();
					goto('/validate');
				}
			})
			.catch(console.error);
	}

	const googleAuthProvider = new GoogleAuthProvider();
	function handleContinueWithGoogle(event: Event) {
		signInWithPopup(getAuth(), googleAuthProvider).then(async () => {
			goto('/').catch(console.error);
		});
	}
</script>

<h1>Sign up</h1>
<form on:submit={handleSubmit}>
	<label for="email">Email</label>
	<input type="email" id="email" name="email" placeholder="Email" />
	<label for="password">Password</label>
	<input type="password" id="password" name="password" placeholder="Password" />
	<button type="submit">Sign up</button>
</form>

<button type="button" on:click={handleContinueWithGoogle}>Sign in with Google</button>
