import { createElement, type ComponentType, type ReactNode } from 'react'

type ProviderProps = {
	children: ReactNode
}

export type ProviderComponent = ComponentType<Readonly<ProviderProps>>

export const composeProviders =
	(...providers: ProviderComponent[]): ProviderComponent =>
	({ children }) => {
		const composedTree = providers.reduceRight((acc, Provider) => createElement(Provider, null, acc), children)

		return composedTree
	}
