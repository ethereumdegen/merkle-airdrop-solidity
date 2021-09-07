import { Contract, Signer } from 'ethers'
import * as hre from 'hardhat'

const { getNamedSigner, contracts, deployments, ethers } = hre

interface TestSetupResult {
  options: Contract
  uriFetcher: Contract
  erc721: Contract
  erc1155: Contract
  createBundle: CreateBundleFn
  user: Signer
  filler: Signer
}

interface CreateBundleArgs {
  721?: number[]
  1155?: [number, number][]
}
export interface TokenBundle {
  types: number[]
  addresses: string[]
  ids: Array<string | number>
  amounts: Array<string | number>
}
export type CreateBundleFn = (args: CreateBundleArgs) => Promise<TokenBundle>

export const setup = deployments.createFixture<TestSetupResult, never>(async () => {
  await hre.deployments.fixture('options', {
    keepExistingDeployments: false
  })

  const user = await getNamedSigner('borrower')
  const filler = await getNamedSigner('lender')

  const options = await contracts.get('TellerOptions')
  const uriFetcher = await contracts.get('TellerOptionURIFetcher')

  const ERC721ContractFactory = await ethers.getContractFactory('MintableERC721')
  const erc721 = await ERC721ContractFactory.deploy()

  const ERC1155ContractFactory = await ethers.getContractFactory('MintableERC1155')
  const erc1155 = await ERC1155ContractFactory.deploy()

  const createBundle: CreateBundleFn = async (args: CreateBundleArgs): Promise<TokenBundle> => {
    const { 721: erc721Ids = [], 1155: erc1155Ids = [] } = args

    const types: number[] = []
    const addresses: string[] = []
    const ids: Array<string | number> = []
    const amounts: Array<string | number> = []

    if (erc721Ids.length > 0)
      await erc721.connect(user).setApprovalForAll(options.address, true)
    for (const id of erc721Ids) {
      await erc721.connect(user).mint(id)

      types.push(0)
      addresses.push(erc721.address)
      ids.push(id)
      amounts.push(1)
    }

    if (erc1155Ids.length > 0)
      await erc1155.connect(user).setApprovalForAll(options.address, true)
    for (const [id, amount] of erc1155Ids) {
      await erc1155.connect(user).mint(id, amount)

      types.push(1)
      addresses.push(erc1155.address)
      ids.push(id)
      amounts.push(amount)
    }

    return {
      types,
      addresses,
      ids,
      amounts
    }
  }

  return {
    options,
    uriFetcher,
    erc721,
    erc1155,
    createBundle,
    user,
    filler,
  }
})
