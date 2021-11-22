// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;  
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./SafeMath.sol";
import "./Ownable.sol";

contract VintageShop is ERC721URIStorage, Ownable {
  using SafeMath for uint256;
  using SafeMath for uint16;
  using Counters for Counters.Counter;

  // a variable to keep track of all the tokens we have issued
  Counters.Counter private _tokenIds;
  ERC721 public nftAddress;
  uint256[] carsForsale;

  address payable public admin; //addres of the admin

  constructor()  ERC721("VintageCarAsset", "VCA"){
    admin = payable(owner());
    
    
  }
  //a mapping for all IPFSHashes associated with a unique token
  mapping(string => uint8) hashes;

  uint8 private _VintangeShopMinimumCommision;
  //mappings

  //each car owner has anuni
  mapping (uint => bytes32) carToHash; 

  // every user should have ab address
  mapping (address => User) users;

  // the list of cars indexed by car hash -> numerical id
  mapping (bytes32 => uint) private carHashes;

  // list of cars bought by users [buyers]
  mapping (address => uint256[]) private boughtTokens;
    
  // lists of cars owned by users [sellers]
  mapping (address => uint256[]) private ownedTokens;

  //maps each car minted as NFT is stored in the car database
  mapping(address => Car[]) public carDatabase;

  mapping(uint256 => Car) public carToken;

  //maps each car minted as NFT to its details such as: name, imageurl,model asnd price
  mapping(uint256=> Car) mappedDetails;

  //maps a users address to a users balance
  mapping(address => uint) balances;

  // <enum State: ForSale, Sold, Shipped, Received>
  // the state tells the current state of the car 
  enum State {ForSale, Sold, Shipped, Received}

  // all users can buy  and sell but needs admin approval to be a seller
  struct User {
    address userAddress; 
    bool isSeller; // is the user a seller or a buyer
    bool isSellerVerified; //a user can be verified as a seller by the admin
    uint8 userExists; //each user is assigned an id
  }


  struct Car {
    uint256 tokenId; // nftID id of the car 
    uint carId; //id of the car
    address payable owner; //address of the vintage car owner to receive funds after pament is being made
    string name; // name of the car
    string model; //model or year of the car
    string carUrl; //imageurl of the car
    uint price; // price of the car
    State state;
    uint120  purchasedCount; //number of car purchases

  }  
  
  

  //events
    //user creation
    event UserCreated(string message, address _userAddress, bool _isSeller);

    //approve a user as a seller
    event SellerVerified(string message, address _userAddress);

    //logforsale for car added
    event ForSale(string message, uint _carId, address seller);

    //check if user exists or is a new user
    event UserExists(string message);

    //emits when the users is a new user
    event NewUser(string message);
   //emits when a car is sold
    event Sold(string message, uint _carId, address buyer);
    //emits when a car is successfully minted as an NFT
    event Minted(string message , uint _tokenId);
    //emits when the car price is recieved by the contract address
    event Received(address buyer, uint _tokenId, uint amount, uint balance);
   
    //emits when a seller is credited by the the admin from the contract
    event Sent(address seller, uint256 amount, uint256 balance);

  //modifiers
  //verify that the caller of the function is an admin
  /** 
     
     * @param _address address of user
     */
  modifier isAdmin(address _address){
    require(_address == admin, "caller must be an admin");
    _;
  }

  //verify if the caller of the function is an admin or user;
   /** 
     * @dev checks if the caller is a user or an admin
     * @param _address address of user
     */
  modifier isUserOrAdmin(address _address){
    require(_address == admin || users[_address].userExists == 1, "user does not exist");
    _;
  }

   /** 
     * @dev checks is seller is verified to sell
     * @param _address address of user?
     */
  modifier IsSellerVerified(address _address){
    require(users[_address].isSeller && users[_address].isSellerVerified, "user is not a seller or is not verified" );
    _;
  }

  /** 
     * @dev checks the owner of the token is the caller
     * @param _tokenId Id of the token
     */
     modifier VerifyNFTOwner(uint256 _tokenId){
      require(ownerOf(_tokenId) == msg.sender);
      _;
     }

      /** 
     * @dev checks the buyer has enough money to buy the Car
     * @param _tokenId Id of the token to get exact price of the token
     */
     modifier hasEnough(uint256 _tokenId){
      address seller = ownerOf(_tokenId);
       uint sellerPrice = carToken[_tokenId].price;
      //  console.log("sellerPrice", sellerPrice);
       require(msg.value >= sellerPrice);  
       _;
     }

      /** 
     * @dev checks the value is higher than the price and refunds the buyer is there is an extra
     * @param _tokenId Id of the token to get exact price of the token
     */
     modifier checkValue(uint256 _tokenId) {
      //refund them after pay for NFT (why it is before, _ checks for logic before func)
      _;
      address seller = ownerOf(_tokenId);
      uint _price = carToken[_tokenId].price;
      uint amountToRefund = msg.value - _price;
      address payable buyer = payable(msg.sender);
      buyer.transfer(amountToRefund);
    }

     /** 
     * @dev Checks if user exists in Bookshop record
     * @param userAddress Address of user
     */
     modifier userExists(address userAddress){
      require(users[userAddress].userExists == 1, "user does not exist");
      _;
  }







  //functions

   /** 
     * @dev Registers new user
     * @param _isSeller Is new user a car owner?
     */
  function addUser(bool _isSeller) external returns (bool){
    require(users[msg.sender].userExists == 0, "user already exist");
      bool _isSellerVerified = false;
      uint8 _userExists = 1;
      users[msg.sender] = User({
        userAddress: msg.sender,
        isSeller: _isSeller,
        isSellerVerified:_isSellerVerified,
        userExists: _userExists
      });

      emit UserCreated("User created successfully", msg.sender, _isSeller);

      return true;
  }

   /** 
     * @dev Admin verifies a user by assigning isSeller verified to a seller
     * @param _userAddress address of user to be assigned as seller
     */
  function assignAsSeller(address _userAddress) isAdmin(msg.sender) external {
    if(users[_userAddress].isSeller){
      User storage user = users[_userAddress];
      user.isSellerVerified = true;

      emit SellerVerified("seller verified successfully", _userAddress);
    }
    else{
      revert("user is not a seller");
    }
  }

  /** 
     * @dev Seller Mints vintage car as NFT after being verified as seller by the admin for particul
     * @param recipient address of the seller minting the NFT
     * @param hash IPFS Hash of car
     * @param metadata IPFurl of car hash
     */
     function awardItem(address recipient, string memory hash, string memory metadata)
      IsSellerVerified(recipient) external
        returns (uint256)
      {
        require(hashes[hash] != 1);
        hashes[hash] = 1;
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, metadata);
        emit Minted("NFT minted successfully", newItemId);

        return newItemId;
}

  /** 
     * @dev Seller Puts the NFT up forsale
     * @param _tokenId Token to be Sold
     * @param price price the seller wants to sell
     * @param name Name of the car the seller wants to sell
     * @param model model of the car the seller wants to sell
     */
     function addNFT(uint256 _tokenId, uint price, string memory name, string memory model, string memory url)
      IsSellerVerified(msg.sender) VerifyNFTOwner(_tokenId) external{
        require(ownerOf(_tokenId) == msg.sender, "Only token owner can put up token for sell");
        setApprovalForAll(address(this), true);
        ownedTokens[msg.sender].push(_tokenId);
        uint newCarId = carDatabase[msg.sender].length + 1;
        
        carToken[_tokenId].price = price;
        mappedDetails[newCarId] = Car({
          tokenId: _tokenId,
          carId: newCarId,
          price: price,
          name: name,
          carUrl: url,
          model: model,
          state: State.ForSale,
          owner: payable(msg.sender),
          purchasedCount: 0
        });
        carsForsale.push(_tokenId);
        emit ForSale("Car For sale", newCarId, msg.sender);


      
     } 

       /** 
     * @dev Seller tranfers ownership token to the buyer
     * @param from address of the seller
     * @param to address of buyer
     * @param tokenId Id of the token being sold
     */

      function transferFrom(
        address from,
        address to,
        uint256 tokenId
      ) public virtual override {
          //solhint-disable-next-line max-line-length
          require(_isApprovedOrOwner(address(this), tokenId), "ERC721: transfer caller is not owner nor approved");

          _transfer(from, to, tokenId);
      }


      /** 
     * @dev Buyer buys the NFT up forsale
     * @dev the state is updated to sold
     * @param tokenId Id of Token to be Sold

     */
     function purchaseNFT (uint256 tokenId)
      isUserOrAdmin(msg.sender) hasEnough(tokenId) checkValue(tokenId) payable external {
        address payable seller = payable(ownerOf(tokenId));
        uint _price = carToken[tokenId].price;
        // balances[address(this)] +=_price;
        admin.transfer(_price);
        transferFrom(seller, msg.sender, tokenId);
        boughtTokens[msg.sender].push(tokenId);
        // carDatabase[seller][tokenId].state = State.Sold;
        emit Received(msg.sender, tokenId, msg.value, address(this).balance);

     }

    //  functi  on getCarPrice(uint)

    
    /**
    * @dev admin sends / withdraw _amount to seller
       * @param _seller Address of the seller
       * @param _amount Amount to send to the seller
    */
    function sendTo(address payable _seller, uint256 _amount) payable external onlyOwner {
      require(_seller != address(0) && _seller != address(this));
      require(_amount > 0 && _amount <= address(this).balance);
      _seller.transfer(_amount);
      emit Sent(_seller, _amount, address(this).balance);
      }
  

        /**
    * @dev gets the cars avaialable  forsale
    */ 
      function getCarForSale() public view returns(Car[] memory ){
        Car[] memory details = new Car[](carsForsale.length);

        for(uint256 x=0;x<carsForsale.length;x++){
          details[x] = mappedDetails[carsForsale[x]];
        }
     
      return details;
      }
        /**
     * @dev requests for tokens paid for by an existion user
     */
      // TO DO: fetching images tied to each token  and returning it whith the array
      function getPurchasedTokens(address _user) userExists(_user) view public returns(uint256[] memory _boughtTokens ){
        _boughtTokens = boughtTokens[_user];
      }
      
   
         /**
     * @dev Checks if User exists before signing in user 
     */
    function checkUser() view external returns (bool _exists) {
      if(users[msg.sender].userExists == 1){
        _exists = true;
      } else{
        _exists = false;
        // emit NewUser("this is a new user");
      }
      return _exists;
      
    }

      /**
     * @dev Verify/Authenticate Admin
     */
    function getAdmin() view external returns (bool _isAuth, bool _isAdmin ) {
      _isAuth = true;
      if(msg.sender == admin){
        _isAdmin = true;
      }
     
    }
  

  
}
