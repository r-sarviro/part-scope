export const partQueryKeys = {
  all: ['parts'] as const,
  manufacturers: (article: string) =>
    [...partQueryKeys.all, 'manufacturers', article] as const,
  offers: (article: string, brand: string) =>
    [...partQueryKeys.all, 'offers', article, brand] as const,
}
