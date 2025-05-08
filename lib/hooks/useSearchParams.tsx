'use client'

import {
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
  type ReadonlyURLSearchParams,
} from 'next/navigation'

type ReturnType = {
  searchParams: ReadonlyURLSearchParams
  setParam(key: string, value: string): void
  removeParam(key: string): void
}

export function useSearchParams(): ReturnType {
  const searchParams = useNextSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)

    router.push(`${pathname}?${params.toString()}`)
  }

  const removeParam = (key: string) => {
    if (searchParams.get(key)) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete(key)

      router.push(`${pathname}?${params.toString()}`)
    }
  }

  return {
    searchParams,
    removeParam,
    setParam,
  }
}
