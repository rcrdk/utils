import type { ComponentPropsWithoutRef, ElementType } from 'react'

interface TextOwnProps<T extends ElementType = 'p'> {
	as?: T
	someProp?: boolean
}

type TextProps<T extends ElementType = 'p'> = TextOwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof TextOwnProps<T>>

export function Text<T extends ElementType = 'p'>({ as, ...props }: Readonly<TextProps<T>>) {
	const Component = (as ?? 'p') as ElementType

	return <Component {...props} />
}
