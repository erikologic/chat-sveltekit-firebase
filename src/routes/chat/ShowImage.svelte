<script lang="ts">
	import { getDownloadURL, getStorage, ref } from 'firebase/storage';

	export let imagePath: string;
	let imageUrl: string | null;

	const storage = getStorage();
	const storageRef = ref(storage, imagePath);
	getDownloadURL(storageRef)
		.then((url) => {
			imageUrl = url;
		})
		.catch(console.error);
</script>

{#if imageUrl}
	<img src={imageUrl} alt="User pic" />
{/if}
