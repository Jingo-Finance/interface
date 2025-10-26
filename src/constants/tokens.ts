import { Ether, NativeCurrency, Token, WETH9 } from '@jingofi/sdk-core'
import { SupportedChainId } from 'constants/chains'

import { UNI_ADDRESS } from './addresses'

export const NATIVE_CHAIN_ID = 'NATIVE'

// When decimals are not specified for an ERC20 token
// use default ERC20 token decimals as specified here:
// https://docs.openzeppelin.com/contracts/3.x/erc20
export const DEFAULT_ERC20_DECIMALS = 18

export const USDC_INK = new Token(
  SupportedChainId.PLASMA,
  '0x368433CaC2A0B8D76E64681a9835502a1f2A8A30',
  6,
  'USDC',
  'USD Coin'
)
const USDC_INK_TANENBAUM = new Token(
  SupportedChainId.INK_TANENBAUM,
  '0x2Be160796F509CC4B1d76fc97494D56CF109C3f1',
  6,
  'USDC',
  'USD Coin'
)
export const DAI_INK = new Token(
  SupportedChainId.PLASMA,
  '0x5B0aC6194499621630ddebb30c4aBE37037b30Ec',
  18,
  'DAI',
  'Dai'
)
export const USDT_INK = new Token(
  SupportedChainId.PLASMA,
  '0x28c9c7Fb3fE3104d2116Af26cC8eF7905547349c',
  6,
  'USDT',
  'Tether USD'
)
export const WBTC_INK = new Token(
  SupportedChainId.PLASMA,
  '0x2A4DC2e946b92AB4a1f7D62844EB237788F9056c',
  8,
  'WBTC',
  'Wrapped BTC'
) // TODO: add WBTC to plasma

export const UNI: { [chainId: number]: Token } = {
  [SupportedChainId.PLASMA]: new Token(
    SupportedChainId.PLASMA,
    UNI_ADDRESS[SupportedChainId.PLASMA],
    18,
    'PSYS',
    'Jingo'
  ),
  [SupportedChainId.INK_TANENBAUM]: new Token(
    SupportedChainId.INK_TANENBAUM,
    UNI_ADDRESS[SupportedChainId.INK_TANENBAUM],
    18,
    'PSYS',
    'Jingo'
  ),
}

export const WRAPPED_NATIVE_CURRENCY: { [chainId: number]: Token | undefined } = {
  ...(WETH9 as Record<SupportedChainId, Token>),
  [SupportedChainId.PLASMA]: new Token(
    SupportedChainId.PLASMA,
    '0x4200000000000000000000000000000000000006',
    18,
    'WSYS',
    'Wrapped PLASMA'
  ),
  [SupportedChainId.INK_TANENBAUM]: new Token(
    SupportedChainId.INK_TANENBAUM,
    '0x4200000000000000000000000000000000000006',
    18,
    'WSYS',
    'Wrapped PLASMA'
  ),
}

class ExtendedEther extends Ether {
  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (wrapped) return wrapped
    throw new Error(`Unsupported chain ID: ${this.chainId}`)
  }

  private static _cachedExtendedEther: { [chainId: number]: NativeCurrency } = {}

  public static onChain(chainId: number): ExtendedEther {
    return this._cachedExtendedEther[chainId] ?? (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId))
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency | Token } = {}
export function nativeOnChain(chainId: number): NativeCurrency | Token {
  if (cachedNativeCurrency[chainId]) return cachedNativeCurrency[chainId]

  const nativeCurrency: NativeCurrency | Token = ExtendedEther.onChain(chainId)
  return (cachedNativeCurrency[chainId] = nativeCurrency)
}

export const TOKEN_SHORTHANDS: { [shorthand: string]: { [chainId in SupportedChainId]?: string } } = {
  USDC: {
    [SupportedChainId.PLASMA]: USDC_INK.address,
    [SupportedChainId.INK_TANENBAUM]: USDC_INK_TANENBAUM.address,
  },
}
