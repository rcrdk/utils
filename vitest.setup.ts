import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

process.env.SKIP_ENV_VALIDATION = 'true'

afterEach(() => {
	cleanup()
})
