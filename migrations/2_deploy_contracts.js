var VintageShop = artifacts.require("./VintageShop");
const commission = 10;
module.exports = function(deployer) {
  deployer.deploy(VintageShop);
};
