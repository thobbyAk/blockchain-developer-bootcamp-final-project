// const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
let BN = web3.utils.BN;
const VintageShop = artifacts.require("./VintageShop");
let { catchRevert } = require("./exceptionHelpers.js");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("vintageShop", function ( accounts ) {
  // it("should assert true", async function () {
  //   await VintageShop.deployed();
  //   return assert.isTrue(true);
  // });
  const admin_comission = 10;
  const admin = accounts[0];   
  const excessAmount = "2000";   
  const isSeller = accounts[1];    
  const isBuyer = accounts[2];  
  const emptyAddress = "0x0000000000000000000000000000000000000000";
  const metadata = "ipfs://QmfAvnM89JrqvdhLymbU5sXoAukEJygSLk9cJMBPTyrmxo"
  const hash = "0x077e6a913a751f6cebd283470a0ab47ecff2e3e80c2dc089f031f909cd617df1"
  let instance;
  
  var carOne = {
    IPFShash: "0x077e6a913a751f6cebd283470a0ab47ecff2e3e80c2dc089f031f909cd617df1",
    hash: "",
    _name: "Mercedez Benz ",
    Model: "230 E",
    price: 400,
    commission: 10,
    State: VintageShop.State.ForSale
    };
    

    beforeEach(async () =>{
      instance = await VintageShop.new();
    })

    describe("Variables", () =>{
     
      describe("enum State", () => {
        let enumState;
        before(() => {
          enumState = VintageShop.enums.State;
          assert(
            enumState,
            "The contract should define an Enum called State"
          );
        });
  
        it("should define `ForSale`", () => {
          assert(
            enumState.hasOwnProperty('ForSale'),
            "The enum does not have a `ForSale` value"
          );
        });
  
        it("should define `Sold`", () => {
          assert(
            enumState.hasOwnProperty('Sold'),
            "The enum does not have a `Sold` value"
          );
        });
  
        it("should define `Shipped`", () => {
          assert(
            enumState.hasOwnProperty('Shipped'),
            "The enum does not have a `Shipped` value"
          );
        });
  
        it("should define `Received`", () => {
          assert(
            enumState.hasOwnProperty('Received'),
            "The enum does not have a `Received` value"
          );
        });
      })
      describe("Use Cases", ()=>{
        it("should add a user with provided boolean", async () =>{
          await instance.addUser(true, {from: isSeller})

          // assert.equal(addUser.logs[0].event, "UserCreated", "user creation emitted right event");  
        })
        it("should emit a UserCreated event when a user is added ", async () => {
          let eventEmitted = false;
          const tx = await instance.addUser(true);
          if(tx.logs[0].event == "UserCreated"){
            eventEmitted = true
          }
          assert.equal(
            eventEmitted,
            true,
            "adding a user should emit a UserCreated event",
          );
        });
        it("should  revert when someone that is not an admin tries to assigns a seller", async () =>{
          // console.log('selle', isSeller);
          await instance.addUser(true,{from: isSeller});
          await catchRevert(instance.assignAsSeller(isSeller, {from: isSeller}));
        });
        it("should emit SellerVerified event when a seller is verified", async () =>{
          let eventEmitted = false;
          await instance.addUser(true,{from: isSeller});
          const tx = await instance.assignAsSeller(isSeller, {from: admin});
          if(tx.logs[0].event == "SellerVerified"){
            eventEmitted = true
          }
          assert.equal(
            eventEmitted,
            true,
            "verifying a seller should emit a SellerVerified event",
          );
        });
       
      
        it("should emit NFT minted once an nft is minted", async () =>{
          let eventEmitted = false;
          let addUser = await instance.addUser(true,{from: isSeller});
          assert.equal(addUser.logs[0].event, "UserCreated", "user creation emitted right event");
          let verifySeller = await instance.assignAsSeller(isSeller, {from: admin});
          assert.equal(verifySeller.logs[0].event, "SellerVerified", "seller verification emitted right event");

          const tx = await instance.awardItem(isSeller, hash, metadata, {from: isSeller});
          if(tx.logs[1].event == "Minted"){
            eventEmitted = true
          }

          assert.equal(
            eventEmitted,
            true,
            "Mintiin an NFT should emit a MInted event",
          );
        });
        it("should emit Car Forsale  event when a car is added", async () =>{
          const tokenId = new BN('1');
          let eventEmitted = false;
          let addUser = await instance.addUser(true,{from: isSeller});
          assert.equal(addUser.logs[0].event, "UserCreated", "user creation emitted right event");
          let verifySeller = await instance.assignAsSeller(isSeller, {from: admin});
          assert.equal(verifySeller.logs[0].event, "SellerVerified", "seller verification emitted right event");
         const result = await instance.awardItem(isSeller, hash, metadata, {from: isSeller});
        //  console.log('resultNFT', result)
          const tx = await instance.addNFT(tokenId, carOne.price, carOne._name, carOne.Model, {from: isSeller});
          // console.log('resultaddNFT', tx)
          if(tx.logs[0].event == "ForSale"){
            eventEmitted = true
          }
          
          assert.equal(
            eventEmitted,
            true,
            "Adding a car should emmit ForSale event",
          );
        });
        it("should  revert when someone that is not a owner tries to add an NFT", async () =>{
          // console.log('selle', isSeller);
          const tokenId = new BN('1');
          await instance.addUser(true,{from: isSeller});
          await instance.assignAsSeller(isSeller, {from: admin});
          await instance.awardItem(isSeller, hash, metadata, {from: isSeller});
          await catchRevert(instance.addNFT(tokenId, carOne.price, carOne._name, carOne.Model, {from: isBuyer}));
        });
        it("should allow a buyer to purchase NFT and update state accordingly ", async () =>{
          // console.log('selle', isSeller);
          const tokenId = new BN('1');
          await instance.addUser(true,{from: isSeller});
          await instance.addUser(false,{from: isBuyer});
          
          var sellerBalanceBefore = await web3.eth.getBalance(isSeller);
          var buyerBalanceBefore = await web3.eth.getBalance(isBuyer);
          var adminBalancebefore = await web3.eth.getBalance(admin);

          console.log('befores', sellerBalanceBefore);
          console.log('beforb', buyerBalanceBefore);
          console.log('beforb', adminBalancebefore);
          await instance.assignAsSeller(isSeller, {from: admin});
          await instance.awardItem(isSeller, hash, metadata, {from: isSeller});
          await instance.addNFT(tokenId, carOne.price, carOne._name, carOne.Model, {from: isSeller});

          await instance.purchaseNFT(tokenId, { from: isBuyer, value: excessAmount });

          var sellerBalanceAfter = await web3.eth.getBalance(isSeller);
          var buyerBalanceAfter = await web3.eth.getBalance(isBuyer);
          var adminBalanceAfter = await web3.eth.getBalance(admin);
          console.log('afters', sellerBalanceAfter);
          console.log('afterb', buyerBalanceAfter);
          console.log('afterb', adminBalanceAfter);
        });
      })
    })

});
