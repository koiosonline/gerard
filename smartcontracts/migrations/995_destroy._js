var KOIOSNFT = artifacts.require("KOIOSNFT");

 
module.exports = async function(deployer) {
  
  KOIOSNFTContract = await KOIOSNFT.deployed()
  
  await KOIOSNFTContract.destroy();
  
};

 