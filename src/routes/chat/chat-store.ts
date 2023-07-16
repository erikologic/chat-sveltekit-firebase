import { writable } from 'svelte/store';
import { db } from '$lib/firebase';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

interface Message {
	id: string;
	message: string;
	email: string;
	createdAt: number;
    imagePath: string;
}

const messages = writable<Message[]>([]);

db.collection('chat')
	.orderBy('createdAt')
	.onSnapshot((snapshot) => {
		const newMessages: Message[] = [];
		snapshot.forEach((doc) => {
			const message = doc.data() as Message;
			message.id = doc.id;
			newMessages.push(message);
		});
		messages.set(newMessages);
	});

async function sendMessage(message: string, image: File | null) {
	const createdAt = Date.now();
	const email = getAuth().currentUser!.email;
	let imagePath = '';
	if (image) {
		const timestamp = new Date().toISOString();
        const storage = getStorage();
		const storageRef = ref(storage, `chat/${timestamp}-${email}-${image.name}`);
		await uploadBytes(storageRef, image);
		imagePath = storageRef.fullPath;
	}
	db.collection('chat').add({ message, createdAt, email, imagePath });
}

export { messages, sendMessage };
