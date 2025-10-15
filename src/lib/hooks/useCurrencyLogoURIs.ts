import { SupportedChainId } from 'constants/chains'
import useHttpLocations from 'hooks/useHttpLocations'
import { useMemo } from 'react'
import { isAddress } from 'utils'

import sysLogo from '../../assets/images/syslogo.png'
import { NATIVE_CHAIN_ID } from '../../constants/tokens'

type Network = 'plasma' | 'rollux_tanenbaum'
// eslint-disable-next-line import/no-unused-modules
export function chainIdToNetworkName(networkId: SupportedChainId): Network {
  switch (networkId) {
    // case SupportedChainId.MAINNET:
    // return 'ethereum'
    // case SupportedChainId.ARBITRUM_ONE:
    // return 'arbitrum'
    case SupportedChainId.PLASMA:
      return 'plasma'
    case SupportedChainId.PLASMA_TANENBAUM:
      return 'rollux_tanenbaum'
    // case SupportedChainId.POLYGON:
    // return 'polygon'
    // case SupportedChainId.BNB:
    // return 'smartchain'
    default:
      return 'plasma'
  }
}

export function getNativeLogoURI(chainId: SupportedChainId = SupportedChainId.PLASMA): string {
  switch (chainId) {
    case SupportedChainId.PLASMA:
      return sysLogo
    default:
      return sysLogo
  }
}

// TODO: review token log with raw link
function getTokenLogoURI(address: string, chainId: SupportedChainId = SupportedChainId.PLASMA): string | void {
  // const networkName = chainIdToNetworkName(chainId)
  // const networksWithUrls = [
  //   // SupportedChainId.ARBITRUM_ONE,
  //   // SupportedChainId.MAINNET,
  //   SupportedChainId.PLASMA,
  //   SupportedChainId.PLASMA_TANENBAUM,
  //   // SupportedChainId.BNB,
  // ]
  return `https://raw.githubusercontent.com/jingo-fi/default-token-list/master/src/logos/${chainId}/${address}/logo.png`

  // Celo logo logo is hosted elsewhere.
  // if (isCelo(chainId)) {
  //   if (address === nativeOnChain(chainId).wrapped.address) {
  //     return 'https://raw.githubusercontent.com/ubeswap/default-token-list/master/assets/asset_CELO.png'
  //   }
  // }
}

export default function useCurrencyLogoURIs(
  currency:
    | {
        isNative?: boolean
        isToken?: boolean
        address?: string
        chainId: number
        logoURI?: string | null
      }
    | null
    | undefined
): string[] {
  const locations = useHttpLocations(currency?.logoURI)
  return useMemo(() => {
    const logoURIs = [...locations]
    if (currency) {
      if (currency.isNative || currency.address === NATIVE_CHAIN_ID) {
        logoURIs.push(getNativeLogoURI(currency.chainId))
      } else if (currency.isToken || currency.address) {
        const checksummedAddress = isAddress(currency.address)
        const logoURI = checksummedAddress && getTokenLogoURI(checksummedAddress, currency.chainId)
        if (logoURI) {
          logoURIs.push(logoURI)
        }
      }
    }
    return logoURIs
  }, [currency, locations])
}
