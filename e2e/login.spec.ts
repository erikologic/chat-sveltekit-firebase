import { test, expect } from '@playwright/test';
import { getRandomChars } from './helpers/tools';
import { deleteUser, login, signup, validateEmail } from './helpers/user-management';

// eslint-disable-next-line
test.beforeEach(async ({}, testInfo) => {
	const myEmail = `test-${getRandomChars()}@test.com`;

	await testInfo.attach('email', { body: myEmail });
});

test.afterEach(async ({ page }, testInfo) => {
	await page.close();
	const myEmail = testInfo.attachments.find(({ name }) => name === 'email').body.toString();

	await deleteUser(myEmail);
});

// AS A new user
// I WANT TO sign up
// SO THAT I can use the app
test('new users can sign up / sign in', async ({ page }, testInfo) => {
	const myEmail = testInfo.attachments.find(({ name }) => name === 'email').body.toString();
	const myPassword = 'password';

	// go to landing page
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Landing page' })).toBeVisible();

	// try login with not existing credentials
	await page.getByRole('link', { name: 'I already have an account' }).click();
	await login(page, myEmail, myPassword);
	await expect(page.getByText('Invalid email or password')).toBeVisible();

	// now sign up
	await page.getByRole('link', { name: 'Sign up' }).click();
	await signup(page, myEmail, myPassword);

	// email must be validated to sign in
	await expect(page.getByRole('heading', { name: 'Validate email' })).toBeVisible();
	await page.getByRole('link', { name: 'Sign in' }).click();
	await login(page, myEmail, myPassword);
	await expect(page.getByRole('heading', { name: 'Validate email' })).toBeVisible();

	// simulate click the verify email
	await validateEmail(myEmail);

	// go to landing page
	await page.goto('/');

	// wrong password -> no login
	await page.getByRole('link', { name: 'I already have an account' }).click();
	await login(page, myEmail, myPassword + 'typo');
	await expect(page.getByText('Invalid email or password')).toBeVisible();

	// right password -> login
	await page.getByPlaceholder('Password').fill(myPassword);
	await page.getByRole('button', { name: 'Login' }).click();

	// once login, user details are visible
	await page.getByRole('link', { name: 'Chat' }).click();
	await expect(page.getByRole('heading', { name: 'Chat' })).toBeVisible();
	await expect(page.getByText(myEmail)).toBeVisible();

	// user can sign out
	await page.getByRole('button', { name: 'Sign out' }).click();
	await expect(page.getByRole('heading', { name: 'Landing page' })).toBeVisible();
	await expect(page.getByText(myEmail)).not.toBeVisible();
});
