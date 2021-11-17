# Avoiding Common Attacks

## Safety checklist
* Automated unit tests were written to ensure that contract logic behaves expectedly.
* Modifiers were used with ``reverts`` to control and restrict malicious access.

The contract applies the following measures to avoid common security pitfalls:
* Proper setting of visibility for functions - [SWC-100](https://swcregistry.io/docs/SWC-100, "swc-100")
    * ``external`` for functions that are only called by externally
    * ``public`` for functions that are called both internally and externally
    * ``payable`` for function that receives ETH payment
    * ``internal`` and ``private`` for functions that are used within the contract
* Use ``require`` to check sender's balances and allowances, where applicable
* The software does not check the return value from a method or function, which can prevent it from detecting unexpected states and conditions. [SWC-104](https://swcregistry.io/docs/SWC-104, "swc-104")
* The use of ``revert()``, and ``require()`` in Solidity, and the new REVERT opcode in the EVM. [SWC-110](https://swcregistry.io/docs/SWC-110, "swc-110")
* Use Openzeppelin's Address library to validate ERC721(ownerOf) token contract addresses (ownerOf() function).
* Denial of Service with Failed Call[SWC-113](https://swcregistry.io/docs/SWC-113, "swc-113"): withdrawal payment design pattern was used in the ``purchaseNFT`` function and ``hasEnough``  ensuring that the buyer has enough and the contract wouldnt loose control if the transfer call kept reverting.