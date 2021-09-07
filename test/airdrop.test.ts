import { Contract, Signer } from 'ethers'
import * as hre from 'hardhat'
import { CreateBundleFn, setup } from './helpers/setup'

const { use, should, expect } = require('chai')
const { solidity } = require('ethereum-waffle')

use(solidity)
should()
 

describe('MerkleAirdrop', function () {
  let airdropContract: Contract
    
  let user: Signer
  let filler: Signer

  beforeEach(async () => {
    
    
  })

  const addressList = require('../config/airdropList.json')


 
  describe('merkle tree ', () => {
    it('should be able to verify offchain', async () => {
     
        

      const { MerkleTree } = require('merkletreejs')
      const SHA256 = require('crypto-js/sha256')

      const leaves = addressList.map((x:any) => SHA256(x))
      const tree = new MerkleTree(leaves, SHA256)
      const root = tree.getRoot().toString('hex')
      const leaf = SHA256('0x7132c9f36abe62eab74cdfdd08c154c9ae45691b')
      const proof = tree.getProof(leaf)
      console.log(tree.verify(proof, leaf, root)) // true

      console.log('airdrop root is ', root)

      expect(tree.verify(proof, leaf, root)).to.equal(true)


      const badLeaves = ['a', 'x', 'c'].map((x:any) => SHA256(x))
      const badTree = new MerkleTree(badLeaves, SHA256)
      const badLeaf = SHA256('x')
      const badProof = tree.getProof(badLeaf)
      console.log(tree.verify(badProof, leaf, root)) // false

      expect(tree.verify(badProof, leaf, root)).to.equal(false)

    })
  })



  describe('token contract ', () => {
    it('should be able to mint', async () => {
      

    })
  })
  
})
