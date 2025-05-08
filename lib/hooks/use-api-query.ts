'use client'

import { useState } from 'react'

type UseQueryInputType<T extends Object = {}> = {
  defaultValues?: T
  onChangeQuery?(query: T): void
}

type UseQueryReturnType<T extends Object = {}> = {
  query: T
  changeQuery(key: keyof T, value: any): void
  reset(): void
}

export function useApiQuery<T extends Object = {}>({
  defaultValues,
  onChangeQuery,
}: UseQueryInputType<T>): UseQueryReturnType<T> {
  const [query, setQuery] = useState<T>(defaultValues || ({} as any))

  const changeQuery = (key: keyof T, value: any) => {
    const newData = { ...query, [key]: value }
    setQuery(newData)
    onChangeQuery?.(newData)
  }

  const reset = () => setQuery(defaultValues || ({} as any))

  return {
    query,
    changeQuery,
    reset,
  }
}
