<script lang="ts">
	let messages: string[] = [];

	function handleSubmit(event: Event) {
		// add message to messages
		const message = (event.target as HTMLFormElement)?.message?.value;
		messages = messages.concat(message);
	}
</script>

<h1>Chat</h1>

{#each messages as message}
	<p>{message}</p>
{/each}

<form on:submit={handleSubmit}>
	<label for="message">Message</label>
	<input type="text" id="message" name="message" placeholder="Message" />
	<button type="submit">Send</button>
</form>
