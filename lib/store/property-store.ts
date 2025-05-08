import { create } from 'zustand'
import type { Property, SearchProperties } from '../types/types'
import { persist } from 'zustand/middleware'

type PropertyState = {
  query?: SearchProperties
  properties?: Property[] | undefined
}

type PropertyActions = {
  updateQuery?(q: SearchProperties): void
  updateSpecificQueryAttr?(key: keyof SearchProperties, value: any): void
  setProperties?(properties: Property[]): void
}

export type PropertyStore = PropertyState & PropertyActions

export const usePropertyStore = create<PropertyStore>()((set, get) => ({
  query: { page: 1, limit: 10 },
  updateQuery: (q) => set({ query: q }),
  updateSpecificQueryAttr: (key: keyof SearchProperties, value: any) =>
    set({ query: { ...get().query, [key]: value } }),
  setProperties: (properties) => set({ properties }),
}))

export const usePersistedPropertyStore = create<PropertyStore>()(
  persist(
    (set, get) => ({
      properties: [],
      setProperties(properties) {
        set({ properties })
      },
    }),
    { name: 'property-store' }
  )
)
