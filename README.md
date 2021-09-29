## Merkle Airdrop Toolkit

A template for deploying a Solidity Contract that uses merkle proofs to 'allowlist' callers of a method.  


##### Run Tests
`yarn`
`yarn compile`
`yarn test `


##### Getting Started

1. edit config/airdropList.json  so that it represents your allow list  
2. run   'yarn test'  and you will see an 'airdrop root' output value.  use this to deploy the contract ( see  deploy/airdrop.ts )
3. Once the contract is deployed, users will need a proof with their address to call 'mintWithProof'  (see the test for how to generate the proof in your dapp frontend)

