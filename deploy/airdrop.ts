import { DeployFunction } from 'hardhat-deploy/types'

import { deploy } from '../utils/deploy-helpers'
import { BigNumberish, BigNumber as BN } from 'ethers'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const deployOptions: DeployFunction = async (hre) => {
  const { getNamedSigner, run, log } = hre
  const deployer = await getNamedSigner('deployer')

  // Make sure contracts are compiled
  await run('compile')

  log('')
  log('********** Teller Options **********', { indent: 1 })
  log('')

  const tellerOptions = await deploy({
    contract: 'AirdropToken',
    name: 'AirdropToken',
    args: ['Airdrop Token','ADT','0xc2ea70ed0d861a2536d5a15b3c4acbb72dcd577b4d75d8c07743c716d813bf4d','0xb6ed7644c69416d67b522e20bc294a9a9b405b31'],
    hre
    
  }) 
 
}
 

deployOptions.tags = ['airdrop']
deployOptions.dependencies = []

export default deployOptions
