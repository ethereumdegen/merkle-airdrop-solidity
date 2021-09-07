import { Network } from 'hardhat/types'
import path from 'path'

import {
  AssetSettings,
  ATMs,
  Chainlink,
  Market,
  NetworkTokens,
  NFTMerkleTree,
  Nodes,
  PlatformSettings,
  Signers,
  TierInfo,
  Tokens,
} from '../types/custom/config-types'
 
 
import { nodes } from './nodes'
import { platformSettings } from './platform-settings'
import { signers } from './signers'
 

/**
 * Checks if the network is Ethereum mainnet or one of its testnets
 * @param network HardhatRuntimeEnvironment Network object
 * @return boolean
 */
export const isEtheremNetwork = (network: Network): boolean =>
  ['mainnet', 'kovan', 'rinkeby', 'ropsten'].some(
    (n) => n === getNetworkName(network)
  )

export const getNetworkName = (network: Network): string =>
  process.env.FORKING_NETWORK ?? network.name

 
 

export const getNodes = (network: Network): Nodes =>
  nodes[getNetworkName(network)]

export const getPlatformSettings = (network: Network): PlatformSettings =>
  platformSettings[getNetworkName(network)]

export const getSigners = (network: Network): Signers => signers[network.name]
 
 

 