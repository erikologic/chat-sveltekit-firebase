import { expect, test } from '@playwright/test';
import { deleteUser, signupAndLogin } from './helpers/user-management';
import { getRandomChars, testInfoToEmail } from './helpers/tools';

test.beforeEach(async ({ page }, testInfo) => {
	const myEmail = testInfoToEmail(testInfo.title);
	await testInfo.attach('email', { body: myEmail });

	await signupAndLogin(page, myEmail);

	await expect(page.getByRole('heading', { name: 'Chat' })).toBeVisible();
});

test.afterEach(async ({ page }, testInfo) => {
	await page.close();
	const myEmail = testInfo.attachments
		.find(({ name }) => name === 'email')
		.body.toString();
	await deleteUser(myEmail);
});

test('chat', async ({ page }) => {
	// send a message
	const message = 'Hello world: ' + getRandomChars();
	await page.getByPlaceholder('Message').fill(message);
	await page.getByRole('button', { name: 'Send' }).click();
	await expect(page.getByText(message)).toBeVisible();

	// send another one
	const secondMessage = 'Hello world: ' + getRandomChars();
	await page.getByPlaceholder('Message').fill(secondMessage);
	await page.getByRole('button', { name: 'Send' }).click();
	await expect(page.getByText(secondMessage)).toBeVisible();
});

test('chat with another browser', async ({
	page: alicePage,
	browser,
}, testInfo) => {
	// log in Bob
	const bobPage = await browser.newContext().then(c => c.newPage());
	const bobEmail = testInfoToEmail(testInfo.title + '_bob');
	await signupAndLogin(bobPage, bobEmail);
	await expect(bobPage.getByRole('heading', { name: 'Chat' })).toBeVisible();

	// when Alice sends a message...
	const aliceMessage = 'Hello world from Alice: ' + getRandomChars();
	await alicePage.getByPlaceholder('Message').fill(aliceMessage);
	await alicePage.getByRole('button', { name: 'Send' }).click();

	// ...Bob sees it
	await expect(bobPage.getByText(aliceMessage)).toBeVisible();

	// when Bob sends a message...
	const bobMessage = 'Hello world from Bob: ' + getRandomChars();
	await bobPage.getByPlaceholder('Message').fill(bobMessage);
	await bobPage.getByRole('button', { name: 'Send' }).click();

	// ...Alice sees it
	await expect(alicePage.getByText(bobMessage)).toBeVisible();

	// delete Bob
	await bobPage.close();
	await deleteUser(bobEmail);
});

test('share pics with another browser', async ({
	page: alicePage,
	browser,
}, testInfo) => {
	// log in Bob
	const bobPage = await browser.newContext().then(c => c.newPage());
	const bobEmail = testInfoToEmail(testInfo.title + '_bob');
	await signupAndLogin(bobPage, bobEmail);
	await expect(bobPage.getByRole('heading', { name: 'Chat' })).toBeVisible();

	// when Alice sends a message with a picture...
	const aliceMessage = 'Hello world with image from Alice: ' + getRandomChars();
	await alicePage.getByPlaceholder('Message').fill(aliceMessage);
	await alicePage
		.getByLabel('Upload image')
		.setInputFiles('e2e/fixtures/image.png');
	await alicePage.getByRole('button', { name: 'Send' }).click();

	// ...Bob sees it
	const aliceMessageSection = bobPage
		.getByRole('region')
		.filter({ hasText: aliceMessage });
	expect(await aliceMessageSection.locator('img').screenshot()).toMatchSnapshot(
		'user-message-image.png',
		{ threshold: 0.5 },
	);

	// when Bob sends a message...
	const bobMessage = 'Hello world with image from Bob: ' + getRandomChars();
	await bobPage.getByPlaceholder('Message').fill(bobMessage);
	await bobPage
		.getByLabel('Upload image')
		.setInputFiles('e2e/fixtures/image.png');
	await bobPage.getByRole('button', { name: 'Send' }).click();

	// ...Alice sees it
	const bobMessageSection = alicePage
		.getByRole('region')
		.filter({ hasText: bobMessage });
	expect(await bobMessageSection.locator('img').screenshot()).toMatchSnapshot(
		'user-message-image.png',
		{ threshold: 0.5 },
	);
	// delete Bob
	await bobPage.close();
	await deleteUser(bobEmail);
});
