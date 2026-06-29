import { signInWithGoogleAction } from '@/app/_actions/auth'

export default function LoginPage() {
	return (
		<main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
			<div className="flex w-full max-w-sm flex-col gap-6 text-center">
				<h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">Sign in</h1>
				<p className="text-base text-zinc-600 dark:text-zinc-400">
					Continue with your Google account to access the app.
				</p>
				<form action={signInWithGoogleAction}>
					<button
						type="submit"
						className="flex h-12 w-full items-center justify-center rounded-full bg-black px-5 text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
					>
						Sign in with Google
					</button>
				</form>
			</div>
		</main>
	)
}
