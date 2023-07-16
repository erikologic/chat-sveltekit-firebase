import { writable } from 'svelte/store';
import { db } from '$lib/firebase';
import { getAuth } from 'firebase/auth';

interface Message {
    id: string;
	message: string;
    email: string;
	createdAt: number;
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

function sendMessage(message: string) {
	const createdAt = Date.now();
    const email = getAuth().currentUser!.email;
	db.collection('chat').add({ message, createdAt, email });
}

export { messages, sendMessage };
