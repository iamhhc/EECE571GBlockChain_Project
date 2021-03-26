const EthCV = artifacts.require("EthCV");
module.exports = async (deployer, network, accounts) => {
  deployer.deploy(EthCV);
};
