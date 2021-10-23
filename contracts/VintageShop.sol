// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract VintageShop {
  address payable private admin; //addres of the admin

  constructor() public {
    admin = payable(msg.sender);
  }

  //mappings
  mapping (uint => address) carToOwner;

  // <enum State: ForSale, Sold, Shipped, Received>
  // the state tells the current state of the car 
  enum State {ForSale, Sold, Shipped, Received}

  // all users can buy  and sell but needs admin approval to be a seller
  struct User {
    address userAddress; 
    bool seller; // is the user a seller or a buyer
    bool isSellerVerified; //a user can be verified as a seller by the admin
    uint userdId; //each user is assigned an id
  }
  struct Cars {
    uint carId; //id of the car
    address payable owner; //address of the vintage car owner to receive funds after pament is being made
    string name; // name of the car
    State state;
    uint120  purchasedCount; //number of car purchases

  }  
  Cars[] private carsArr; 

  //events
  // event UserCreated( string message )
}
