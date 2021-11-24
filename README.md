# blockchain-developer-bootcamp-final-project
#  Vintage Car Salses Shop


## Overview
A Blockchain sales shop  which allows vintage car owners(sellers) to upload vintage car onwners to upload their car picture, mint as NFT. Put this NFT up for sale by assigning a name, model and IPF generated URL for car image to it. A buyer is able to register as a buyer abd purchase this token with eth. The eth is transfered to the contract address and only the admin has the power to credit the seller and transfer the ownership of the token to the buyer

## Administator
The sales shop Admin deploys contract,Admin verifies a seller. an unverified seller is unble to upload an NFT for sale. Admin credits a seller for a puechased token by the buyer.

## Car Onwer(seller)
A vintage car owner without having to consult a third party or car sales man can register an account on the blockchain and wait admin approval, once the seller is approved he can mint his car picture as NFT, then put the token up for sale by assigning a price to it.The seller can upload more cars in the case where there the seller has more vintage cars for sale.



## Buyer
The buyer signs in and sees list of vintage car NFT availiable for sale. The buyer is able to purchase the NFT with eth.

# Questions
1. Database needed?
Yes a database is needed to store information of all the car models on the systemm and monitor sales .
2. are there multiple writers?
Yes there are multiple writers on the system(the end users).
3. can a 3rd party be trusted?
No, a third party cannot be trusted with the car infomation and money.
4. access control is not needed.
5. Pubilc blockchain?
yes transactions have to be monitored in this data purchased.

# Workflow
1. Admin deploys the contract.
2. Seller Registers an account on the blockchain.
3. Admin approves the seller
4. Seller mints vintage car picture as NFT and recieves a tokenId and IPFS url for the image uploaded.
5. Seller assigns a name, model, price and IPFS url to this token and uploads it up for sale.
6. Buyer Register an account on the blockchain and sees a list of cars NFT uploaded up for sale by the seller.
7. Buyer is able to purchase the NFT.
8. The token Price is transfred to the contract address
9. Admin can credit the seller based on the token purchased by the buyer. 

---
 [Deployed Website](https://thobbyak.github.io/blockchain-developer-bootcamp-final-project/, "Deployed Website")
---
contract address:0x83E144BF8388AeC3dFDBaFbfbb19563029ae6B6F

## Interact via Ropsten
    The contract is deloyed on the Ropsten network, please  connect to the ropsten network

# Directory Structure
 ```
VintageShop (root)
+-- migrations
|   +-- 1_initial_migration.js
|   +-- 2_deploy_contracts.js 
|
+-- public
|
+-- src
|   +-- abis
|   +-- Component
|   |   +-- navbar.js
|   |
|   +--pages
|   |  +-- home.js
|   |  +-- shop.js
|   |
|   |
|   +-- contracts
|   |   +-- Migrations.sol
|   |   +-- VintageShop.sol    
|   |
|   +-- App.js
|   +-- App.css
|   +-- getWeb3.js
|   +-- index.css
|   +-- index.js
|
+-- test
|   +-- vintage_shop.js    
|
+-- truffle-config.js
+-- package.json
+-- avoiding_common_attacks.md
+-- design_pattern_decisions.md
+-- deployed_address.txt.
```
# Dependencies
To run the Dapp in a local enviroment, the following dependencies are required:
* at least Node v7.21.1
    * download Node: https://nodejs.org/en/download/
* Truffle : `npm i -g truffle`
* HDWallet provider: `npm i @truffle/hdwallet-provider`
* Openzeppelin contracts and libraries: `npm i @openzeppelin/contracts` , `npm i @openzeppelin/contracts`
* ganache : `npm install -g ganache-cli`
* mnemonics: `npm i mnemonics`
* Utils: 
    * .env file : `npm i dotenv`


# How to setup Dapp 
## smart contract
* contacts can be found in `/contracts`

Follow the following steps to test smartcontract
* Navigate to root folder /
* run `npm install` in the terminal to install all dependencies
* run `truffle develop` 
* compile contracts by running `compile`
* Compile and Deploy contracts `truffle migrate --network develop`
* compile, deploy contract and test `truffle test`

## FrontEnd 

* Navigate to the client folder `cd client`
* run `npm install` to install all dependencies
* Launch the user interface via port: 3000 by running the following command in the `client` folder by running `npm run start`
* Access the user interface via `http://localhost:3000`
* If you do not have Metamask browser extension, install `Metamask` in your browser. Connect your Metamask wallet  on the `localhost` network ans start interracting with the app.

`Note an already purchased Car(NFT) cannot be purchased by another buyer yet, this is a feature i am still working on and hoping to add as an update`




