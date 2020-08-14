var ERC20TokenFactory = artifacts.require("ERC20TokenFactory");

module.exports = async function(deployer) {
	
	ERC20TokenFactoryContract = await ERC20TokenFactory.deployed()
	NrTokens=await ERC20TokenFactoryContract.NrTokens();	
	console.log(`NrTokens=${NrTokens}`);
    await ERC20TokenFactoryContract.destroy();	
	NrTokens=await ERC20TokenFactoryContract.NrTokens();	
	console.log(`NrTokens=${NrTokens}`);
};

