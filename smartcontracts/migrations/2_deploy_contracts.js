var KOIOSNFT = artifacts.require("KOIOSNFT");



module.exports = async function(deployer) {
    const IpfsHttpClient = require('ipfs-http-client')
    await deployer.deploy(KOIOSNFT,"koios","koios","ipfs://ipfs/");
    KOIOSNFTContract = await KOIOSNFT.deployed()
    console.log(`KOIOSNFTContract is at address:  ${KOIOSNFTContract.address}`);
    console.log(`totalSupply is now:  ${await KOIOSNFTContract.totalSupply()}`);
};

