interface Props<T extends React.ElementType> {
	as?: T
	someProp?: boolean
		
}

export function Text<T extends React.ElementType = 'p'>({
	as,
	someProp = false,
	...props
}: Props<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof Props<T>>) {
	const Component = as || 'p'

	return (
		<Component
			{...props}
			// someProp
		/>
	)
}
