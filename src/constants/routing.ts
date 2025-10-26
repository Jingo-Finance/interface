// a list of tokens by chain
import { Currency, Token } from '@jingofi/sdk-core'
import { SupportedChainId } from 'constants/chains'

import { nativeOnChain, USDC_INK, USDT_INK, WBTC_INK, WRAPPED_NATIVE_CURRENCY } from './tokens'

type ChainTokenList = {
  readonly [chainId: number]: Token[]
}

type ChainCurrencyList = {
  readonly [chainId: number]: Currency[]
}

const WRAPPED_NATIVE_CURRENCIES_ONLY: ChainTokenList = Object.fromEntries(
  Object.entries(WRAPPED_NATIVE_CURRENCY)
    .map(([key, value]) => [key, [value]])
    .filter(Boolean)
)

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WRAPPED_NATIVE_CURRENCIES_ONLY,
  [SupportedChainId.PLASMA]: [
    ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.PLASMA],
    USDC_INK,
    WBTC_INK,
  ],
}
export const ADDITIONAL_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {}
/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {}

/**
 * Shows up in the currency select for swap and add liquidity
 */
export const COMMON_BASES: ChainCurrencyList = {
  [SupportedChainId.PLASMA]: [
    nativeOnChain(SupportedChainId.PLASMA),
    USDC_INK,
    USDT_INK,
    WBTC_INK,
  ],
  [SupportedChainId.INK_TANENBAUM]: [nativeOnChain(SupportedChainId.INK_TANENBAUM)],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_CURRENCIES_ONLY,
}
export const PINNED_PAIRS: { readonly [chainId: number]: [Token, Token][] } = {}
