import * as Sentry from '@sentry/nextjs'

import { getEdgeSentryOptions } from '@/lib/sentry/config'

Sentry.init(getEdgeSentryOptions())
