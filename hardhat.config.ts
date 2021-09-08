import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@tenderly/hardhat-tenderly'
import '@eth-optimism/hardhat-ovm'
import 'hardhat-contract-sizer'
import 'hardhat-deploy'
import 'hardhat-gas-reporter'

import { config } from 'dotenv'
import { ethers } from 'ethers'
import * as fs from 'fs'
import { HardhatUserConfig } from 'hardhat/config'
import {
  HardhatNetworkHDAccountsUserConfig,
  NetworkUserConfig,
} from 'hardhat/types'
import * as path from 'path'



config()

const {
  ALCHEMY_KOVAN_KEY,
  ALCHEMY_RINKEBY_KEY,
  ALCHEMY_ROPSTEN_KEY,
  ALCHEMY_MAINNET_KEY,
  COMPILING,
  CMC_KEY,
  ETHERSCAN_API_KEY,
  INFURA_KEY,
  FORKING_NETWORK,
  MATIC_MAINNET_KEY,
  MATIC_MUMBAI_KEY,
  MNEMONIC_KEY,
  SAVE_GAS_REPORT,
  TESTING,
} = process.env

if (COMPILING != 'true') {
  require('./tasks')
  require('./utils/hre-extensions')
}
let isTesting = false
if (TESTING === '1') {
  isTesting = true

  require('./test/helpers/chai-helpers')
}

const getLatestDeploymentBlock = (networkName: string): number | undefined => {
  try {
    return parseInt(
      fs
        .readFileSync(
          path.resolve(
            __dirname,
            'deployments',
            networkName,
            '.latestDeploymentBlock'
          )
        )
        .toString()
    )
  } catch {
    // Network deployment does not exist
  }
}

const mnemonic = (): string => {
  try {
    return fs.readFileSync('./mnemonic.txt').toString().trim();
  } catch (e) {
    console.log(
      '☢️ WARNING: No mnemonic file created for a deploy account.'
    )
  }
  return ''
}

const accounts: HardhatNetworkHDAccountsUserConfig = {
  mnemonic: mnemonic(),
  count: 15,
  accountsBalance: ethers.utils.parseEther('100000000').toString(),
}

const networkConfig = (config: NetworkUserConfig): NetworkUserConfig => {
  config = {
    ...config,
    accounts,
  }

  return config
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default <HardhatUserConfig>{
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  tenderly: {
    username: 'teller',
    project: '{see utils/hre-extensions.ts}',
  },
  paths: {
    sources: 'contracts',
  },
  external: {
    contracts: [
      {
        artifacts: 'node_modules/hardhat-deploy/extendedArtifacts',
      },
      {
        artifacts: 'node_modules/@openzeppelin/contracts/build/contracts',
      },
    ],
  },
  solidity: {
    compilers: [
      {
        version: '0.8.4',
        settings: {
          optimizer: {
            enabled: !isTesting,
            runs: 200,
          },
        },
      },
    ],
  },
  ovm: {
    solcVersion: "0.8.4",
  },
  contractSizer: {
    runOnCompile: !!COMPILING,
    alphaSort: false,
    disambiguatePaths: false,
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    coinmarketcap: CMC_KEY,
    outputFile: SAVE_GAS_REPORT ? 'gas-reporter.txt' : undefined,
    noColors: !!SAVE_GAS_REPORT,
    showMethodSig: false,
    showTimeSpent: true,
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
    user: {
      default: "0x7132C9f36abE62EAb74CdfDd08C154c9AE45691B"
    },
    craSigner: {
      hardhat: 10,
      localhost: 10,
    },
    attacker: {
      hardhat: 11,
      localhost: 11,
    },
  },
  networks: {
    kovan: networkConfig({
      url: `https://kovan.infura.io/v3/${INFURA_KEY}`,
      chainId: 42,
      live: true,
    }),
    rinkeby: networkConfig({
      url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
      chainId: 4,
      live: true,
    }),
    ropsten: networkConfig({
      url: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
      chainId: 3,
      live: true,
    }),
    goerli: networkConfig({
      url: `https://goerli.infura.io/v3/${INFURA_KEY}`,
      chainId: 5,
      live: true,
    }),
    mainnet: networkConfig({
      url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
      chainId: 1,
      live: true,
    }),
    polygon: networkConfig({
      url: `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
      chainId: 137,
      live: true,
    }),
    polygon_mumbai: networkConfig({
      url: `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`,
      chainId: 80001,
      live: true,
    }),
    xdai: networkConfig({
      url: 'https://rpc.xdaichain.com/',
      // chainId: ,
      live: true,
    }),
    rinkebyArbitrum: networkConfig({
      url: 'https://rinkeby.arbitrum.io/rpc',
      // chainId: ,
      live: true,
      companionNetworks: {
        l1: 'rinkeby',
      },
    }),
    localArbitrum: networkConfig({
      url: 'http://localhost:8547',
      // chainId: ,
      live: true,
      companionNetworks: {
        l1: 'localArbitrumL1',
      },
    }),
    localArbitrumL1: networkConfig({
      url: 'http://localhost:7545',
      // chainId: ,
      live: true,
      companionNetworks: {
        l2: 'localArbitrum',
      },
    }),
    kovanOptimism: networkConfig({
      url: 'https://kovan.optimism.io',
      // chainId: ,
      live: true,
      ovm: true,
      companionNetworks: {
        l1: 'kovan',
      },
    }),
    localOptimism: networkConfig({
      url: 'http://localhost:8545',
      // chainId: ,
      live: true,
      ovm: true,
      companionNetworks: {
        l1: 'localOptimismL1',
      },
    }),
    localOptimismL1: networkConfig({
      url: 'http://localhost:9545',
      // chainId: ,
      live: true,
      companionNetworks: {
        l2: 'localOptimism',
      },
    }),
    localAvalanche: networkConfig({
      url: 'http://localhost:9650/ext/bc/C/rpc',
      chainId: 43112,
      live: true,
    }),
    fujiAvalanche: networkConfig({
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      chainId: 43113,
      live: true,
    }),
    mainnetAvalanche: networkConfig({
      url: 'https://api.avax.network/ext/bc/C/rpc',
      chainId: 43114,
      live: true,
    }),
    testnetHarmony: networkConfig({
      url: 'https://api.s0.b.hmny.io',
      chainId: 1666700000,
      live: true,
    }),
    mainnetHarmony: networkConfig({
      url: 'https://api.harmony.one',
      chainId: 1666600000,
      live: true,
    }),
    hardhat: networkConfig({
      chainId: 31337,
      live: false,
      allowUnlimitedContractSize: true,
      // forking:
      //   FORKING_NETWORK == null
      //     ? undefined
      //     : {
      //         enabled: true,
      //         url: networkUrls[FORKING_NETWORK],
      //         blockNumber: getLatestDeploymentBlock(FORKING_NETWORK),
      //       },
    }),
    localhost: networkConfig({
      url: 'http://127.0.0.1:8545',
      timeout: 10000000,
    }),
  },
  mocha: {
    timeout: 10000000,
  },
}
