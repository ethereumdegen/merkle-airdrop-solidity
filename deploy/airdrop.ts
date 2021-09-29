import { DeployFunction } from 'hardhat-deploy/types'

import { deploy } from '../utils/deploy-helpers'
import { BigNumberish, BigNumber as BN } from 'ethers'
import { HardhatRuntimeEnvironment } from 'hardhat/types'


const { MerkleTree } = require('merkletreejs') 
const keccak256 = require('keccak256');


const addressList = require('../config/airdropList.json')


const deployOptions: DeployFunction = async (hre) => {
  const { getNamedSigner, run, log } = hre
  const deployer = await getNamedSigner('deployer')

  // Make sure contracts are compiled
  await run('compile')

  log('')
  log('********** Merkle Airdrop **********', { indent: 1 })
  log('')
 

      const leaves = addressList.map((x:any) => keccak256(x))
      const tree = new MerkleTree(leaves, keccak256, {sortPairs: true})
      const root = tree.getRoot().toString('hex')

      const hexRoot = tree.getHexRoot()


      const contractOutput = await deploy({
        contract: 'AirdropToken',
        name: 'AirdropToken',
        args: ['Airdrop Token','ADT', hexRoot,'0xb6ed7644c69416d67b522e20bc294a9a9b405b31'],
        hre
        
      }) 
 

}

deployOptions.tags = ['airdrop']
deployOptions.dependencies = []

export default deployOptions
