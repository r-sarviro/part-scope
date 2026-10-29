import { pluralizeRu } from '@/shared/lib'

export function offerCountLabel(count: number): string {
  return pluralizeRu(count, 'предложение', 'предложения', 'предложений')
}
