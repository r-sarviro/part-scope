function readEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name]
  return typeof value === 'string' ? value : ''
}

export const env = {
  apiBaseUrl: readEnv('VITE_API_BASE_URL'),
  apiKey: readEnv('VITE_API_KEY'),
} as const
