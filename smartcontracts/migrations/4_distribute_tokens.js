var KOIOSNFT = artifacts.require("KOIOSNFT");

 
module.exports = async function(deployer) {
  
  KOIOSNFTContract = await KOIOSNFT.deployed()
  const IpfsHttpClient = require('ipfs-http-client')
  var ipfs = await IpfsHttpClient('https://ipfs.infura.io:5001'); //for infura node
  
  console.log(`KOIOSNFTContract is at address:  ${KOIOSNFTContract.address}`);
  var total=await KOIOSNFTContract.totalSupply()
  console.log(`totalSupply is now:  ${total}`);
  
  var toarray=[
            "0x8e2A89fF2F45ed7f8C8506f846200D671e2f176f", // gerard
            "0xEA9a7c7cD8d4Dc3acc6f0AaEc1506C8D6041a1c5", // gerard canary
            "0x336101f6685906fFe861ac519A98A6736d2D5b37", // phil
            "0xe88cAc4e10C4D316E0d52B82dd54f26ade3f0Bb2", // corwin
            "0x4Ad2eaE4137e11EB3834840f1DC38F5f0fa181c3" // mathieu        
            ]
    
  
    for (var i=0;i<total;i++) {
        var tokenid=parseInt((await KOIOSNFTContract.tokenByIndex(i)).toString())
        console.log(tokenid)
        var tokenURI=await KOIOSNFTContract.tokenURI(tokenid)
        console.log(tokenURI)
        var templateid=parseInt( (await  KOIOSNFTContract.GetTemplateId(tokenid)).toString() )
        console.log(`i=${i} tokenid=${tokenid} tokenURI=${tokenURI} templateid=${templateid}`)        
        tokenURI=tokenURI.replace("ipfs://ipfs/", "");// just keep the cid
        var str=""
        if (tokenURI) {
            for await (const result of ipfs.cat(tokenURI)) {
                str += String.fromCharCode.apply(null, result); // convert uint8array to string        
            }  
        }
        console.log(`Found: ${str}`);       
        await GiveSomeTokens(KOIOSNFTContract,toarray,templateid)    
    }
    for (var i=0;i<toarray.length;i++) 
        console.log(`Balance of ${toarray[i]} is now:  ${await KOIOSNFTContract.balanceOf(toarray[i])}`);

    console.log(`totalSupply is now:  ${await KOIOSNFTContract.totalSupply()}`);  
};

async function GiveSomeTokens(Contract,toarray,templateid) {
  await Contract.createTokens(toarray,templateid);  
}
 