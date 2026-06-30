import { NextResponse } from 'next/server'

export const GET = () => NextResponse.json({ id: '1', message: 'foo' })
