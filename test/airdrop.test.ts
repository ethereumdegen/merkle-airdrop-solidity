import { Contract, Signer } from 'ethers'
import * as hre from 'hardhat'
import { CreateBundleFn, setup } from './helpers/setup'

const { use, should, expect } = require('chai')
const { solidity } = require('ethereum-waffle')

const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')

const web3 = require('web3')


use(solidity)
should()
 

describe('MerkleAirdrop', function () {
  let airdropTokenContract: Contract
    
  let user: Signer
  let deployer: Signer

  beforeEach(async () => {
    const results = await setup()
    airdropTokenContract = results.airdropToken
    user = results.user
    deployer = results.deployer 
    
  })

  const addressList = require('../config/airdropList.json')


 
  describe('merkle tree ', () => {
    it('should be able to verify offchain', async () => {
     
        

    
      const leaves = addressList.map((x:any) => SHA256(x))
      const tree = new MerkleTree(leaves, SHA256)
      const root = tree.getRoot().toString('hex')
      const leaf = SHA256('0x7132c9f36abe62eab74cdfdd08c154c9ae45691b')
      const proof = tree.getProof(leaf)
      console.log(tree.verify(proof, leaf, root)) // true

    
      expect(tree.verify(proof, leaf, root)).to.equal(true)


      const badLeaves = ['a', 'x', 'c'].map((x:any) => SHA256(x))
      const badTree = new MerkleTree(badLeaves, SHA256)
      const badLeaf = SHA256('x')
      const badProof = tree.getProof(badLeaf)
      console.log(tree.verify(badProof, leaf, root)) // false

      expect(tree.verify(badProof, leaf, root)).to.equal(false)

    })
  })

  /*

   

  */

  describe('token contract ', () => {
    it('should be able to mint', async () => {

        
      const leaves = addressList.map((x:any) => SHA256(x))
      const tree = new MerkleTree(leaves, SHA256)
      const root = tree.getRoot().toString('hex')
      
      console.log('airdrop root is ', root)

      const userAddress = await user.getAddress()
      console.log('user address',userAddress)

      const leaf = SHA256(userAddress)
      const proof = tree.getProof(leaf)

      console.log(tree.verify(proof, leaf, root)) // true
      expect(tree.verify(proof, leaf, root)).to.equal(true)

      let bytes32proof = proof.map((x:any) => x.data  )

      //bytes32proof = bytes32proof.filter((x:any) => x.toLowerCase() != userAddress.toLowerCase()   )

      console.log('sample bytes32 ', '0xbec921276c8067fe0c82def3e5ecfd8447f1961bc85768c2a56e6bd26d3c0c53' )
      console.log('bytes32proof',  bytes32proof)


      await airdropTokenContract.connect(user).mintWithProof( bytes32proof );


      let tokenBalance = await airdropTokenContract.connect(user).balanceOf(  user  )

      tokenBalance.should.equal(1)
      

    })
  })
  
})
