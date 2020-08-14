var ERC20TokenFactory = artifacts.require("ERC20TokenFactory");
var ERC20Token = artifacts.require("ERC20Token");

 
module.exports = async function(deployer) {  
    ERC20TokenFactoryContract = await ERC20TokenFactory.deployed()
  	NrTokens=await ERC20TokenFactoryContract.NrTokens();	
	console.log(`NrTokens=${NrTokens}`);
	
	var ERC20TokenContract=[];
	for (var i=0;i<NrTokens;i++) {
		tokenaddress=await ERC20TokenFactoryContract.tokens(i);	
		ERC20TokenContract[i] = await ERC20Token.at(tokenaddress) // don't process directly => timeouts
	}	
	
	var acts=await web3.eth.getAccounts()
	
	for (var i=0;i<NrTokens;i++) {
		name=await ERC20TokenContract[i].name()
		console.log(`Processing contract ${name}`)
		decimals=await ERC20TokenContract[i].decimals()	
		//console.log(`Address token ${tokenaddress} name:${name} decimals:${decimals}`)
	
		const ten = new BN("10")
		const amount = ten.pow(new BN(decimals)).mul(new BN(7))
		for (var j=0;j<toarray.length;j++) 
			await Process(tokenaddress,amount,ERC20TokenContract[i],toarray[j])
		var left=await ERC20TokenContract[i].balanceOf(acts[0])
		console.log(`Left on account ${acts[0]} ${left}`)
	}
			
}  
  

const BN = web3.utils.BN
  
var toarray=[
            "0x8e2A89fF2F45ed7f8C8506f846200D671e2f176f", // gerard
            "0xEA9a7c7cD8d4Dc3acc6f0AaEc1506C8D6041a1c5", // gerard canary
            "0x336101f6685906fFe861ac519A98A6736d2D5b37", // phil
            "0xe88cAc4e10C4D316E0d52B82dd54f26ade3f0Bb2", // corwin
            "0x4Ad2eaE4137e11EB3834840f1DC38F5f0fa181c3" // mathieu        
            ]
    
  
  
async function Process(tokenaddress,amount,contract,dest)  {
	     await contract.transfer(dest, amount)
		 newbalance=await contract.balanceOf(dest)
		 console.log(`Transferred ${amount.toString()} to  ${dest}, which has now: ${newbalance.toString()}`)		
}

 
