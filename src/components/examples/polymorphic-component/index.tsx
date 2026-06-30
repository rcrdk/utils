import type { ComponentPropsWithoutRef, ElementType } from 'react'

interface PolymorphicComponentOwnProps<T extends ElementType = 'p'> {
	as?: T
	someProp?: boolean
}

type PolymorphicComponentProps<T extends ElementType = 'p'> = PolymorphicComponentOwnProps<T> &
	Omit<ComponentPropsWithoutRef<T>, keyof PolymorphicComponentOwnProps<T>>

export function PolymorphicComponent<T extends ElementType = 'p'>({
	as,
	...props
}: Readonly<PolymorphicComponentProps<T>>) {
	const Component = (as ?? 'p') as ElementType

	return <Component {...props} />
}
