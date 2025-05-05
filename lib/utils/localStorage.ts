export const TokenStorage = {
  store: async (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token)
    }
  },
  get: async () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken')
    }
    return null
  },
  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
    }
  },
}   

export const UserStorage = {
  store: (user: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user))
    }
  },
  get: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    }
    return null
  },
  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
  },
}
