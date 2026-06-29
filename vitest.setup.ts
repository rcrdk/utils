import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'vitest'

process.env.SKIP_ENV_VALIDATION = 'true'

expect.extend(matchers)

afterEach(() => {
	cleanup()
})
