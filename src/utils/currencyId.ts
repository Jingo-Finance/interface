import { Currency } from '@pollum-io/sdk-core'

export function currencyId(currency: Currency): string {
  if (currency.isNative) return 'XPL'
  if (currency.isToken) return currency.address
  throw new Error('invalid currency')
}
