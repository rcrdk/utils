import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

type Foo = {
	id: string
	message: string
}

const FOO_QUERY_KEY = 'foo'

type UseFooOptions = Omit<UseQueryOptions<Foo, Error, Foo, string[]>, 'queryKey' | 'queryFn'>

const fetchFoo = async (): Promise<Foo> => {
	const response = await fetch('/api/foo')
	if (!response.ok) throw new Error('Failed to fetch foo')

	const foo = (await response.json()) as Foo
	return foo
}

export const useFoo = (options?: UseFooOptions) => {
	const { data, ...query } = useQuery({
		queryKey: [FOO_QUERY_KEY],
		queryFn: fetchFoo,
		...options,
	})

	const foo = data ?? null

	return {
		foo,
		...query,
	}
}
