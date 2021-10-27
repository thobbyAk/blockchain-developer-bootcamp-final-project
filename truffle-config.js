const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  compilers: {
    solc: {
      version: ">=0.4.22 <0.9.0",
    },
  },
  networks: {
    develop: {
      network_id: "*",
      host:"localhost",
      port: 8545,
      gas: 6721975,
      gasPrice: 20000000000 
    }
    
  },

};
