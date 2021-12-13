const raribleToken = artifacts.require("raribleToken");

module.exports = function (deployer) {
  deployer.deploy(raribleToken);
};