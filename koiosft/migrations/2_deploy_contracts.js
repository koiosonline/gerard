var ERC20TokenFactory = artifacts.require("ERC20TokenFactory");

module.exports = async function(deployer) {
    await deployer.deploy(ERC20TokenFactory);	
	ERC20TokenFactoryContract = await ERC20TokenFactory.deployed()
	console.log(`ERC20TokenFactoryContract is at address:  ${ERC20TokenFactoryContract.address}`);
	
};

