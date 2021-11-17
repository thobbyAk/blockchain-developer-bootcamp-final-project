
# Design Patterns

## Inter-Contract Execution 
    The contract interacts with 
    * Openzeppelin's ERC721URIStorage contract to help get owners address of each token minted based on the token's Id
    * Openzeppelin's ERC721 token contract to allow a seller mint NFT and set approval for  the contract to transfer ownership of a token
    ---
## Inheritance and Interfaces 
    * The Contract inherits from Openzeppelins's ERC721URIStorage which helps with minting of an NFT
    * The Contract inherits from The Ownable contract which has an owner address, and provides basic authorization control functions, this simplifies the implementation of "user permissions.

