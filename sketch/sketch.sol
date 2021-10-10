pragma solidity >=0.5.16 <0.9.0;

contract sketch{

    modifier checkSubcription(){

    _;
 
    }
    modifier checkValue(uint _sku) {
        //refund them after subcribe for plan (why it is before, _ checks for logic before func)
        _;
        
      }
    
    // registerUsers
    function registerUsers(address users) public {
        // registers users
    }

    function subscribe(uint _price,string memory plan ) public payable {
        // require that the caller has enough ether to subsribe ;
    }
    
    
}
