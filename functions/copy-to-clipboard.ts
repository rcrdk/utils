/**
 * Copies the provided text to the clipboard asynchronously.
 *
 * This function attempts to use the Clipboard API to copy the given text to the user's clipboard.
 * If the operation succeeds, it can return a success message (to be implemented).
 * If an error occurs, it logs the error to the console.
 *
 * @param {string} text - The text to be copied to the clipboard.
 *
 * @example
 * copyTextToClipboard('Hello, world!');
 * // Copies 'Hello, world!' to the clipboard
 */
export async function copyTextToClipboard(text: string): Promise<void> {
	try {
		await navigator.clipboard.writeText(text)
        // success message return
	} catch (error) {
		// error message return
		console.error(error)
	}
}