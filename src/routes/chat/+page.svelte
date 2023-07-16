<script lang="ts">
	import ShowImage from './ShowImage.svelte';
	import { messages, sendMessage } from './chat-store';

	function handleSubmit(event: Event) {
		const message = (event.target as HTMLFormElement)?.message?.value;
		const image = (event.target as HTMLFormElement)?.image?.files[0];
		sendMessage(message, image).catch(console.error);
	}
</script>

<h1>Chat</h1>

<ul>
	{#each $messages as { createdAt, email, id, message, imagePath } (id)}
		<li>
			<section aria-label={`Message ID ${id}`}>
				<p>
					({new Date(createdAt).toISOString()}): {email} -&gt; {message}
					{#if imagePath}
						<ShowImage {imagePath} />
					{/if}
				</p>
			</section>
		</li>
	{/each}
</ul>

<form on:submit={handleSubmit}>
	<label for="message">Message</label>
	<input type="text" id="message" name="message" placeholder="Message" />
	<label for="image">Upload image</label>
	<input id="image" type="file" name="image" accept="image/png, image/jpeg" />
	<button type="submit">Send</button>
</form>
