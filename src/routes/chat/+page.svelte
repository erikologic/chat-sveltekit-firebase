<script lang="ts">
	import { messages, sendMessage } from './chat-store';

	function handleSubmit(event: Event) {
		// add message to messages
		const message = (event.target as HTMLFormElement)?.message?.value;
		sendMessage(message);
	}
</script>

<h1>Chat</h1>

<ul>
	{#each $messages as { createdAt, email, id, message } (id)}
		<li>
			<section aria-label={`Message ID ${id}`}>
				<p>
					({new Date(createdAt).toISOString()}): {email} -&gt; {message}
				</p>
			</section>
		</li>
	{/each}
</ul>

<form on:submit={handleSubmit}>
	<label for="message">Message</label>
	<input type="text" id="message" name="message" placeholder="Message" />
	<button type="submit">Send</button>
</form>
