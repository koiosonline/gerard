var ERC20TokenFactory = artifacts.require("ERC20TokenFactory");
var ERC20Token = artifacts.require("ERC20Token");

const fetch = require('node-fetch');
const fs2 = require('fs');
const token = fs2.readFileSync(".figma").toString().trim();
const documentid = fs2.readFileSync(".figmadocument").toString().trim();
console.log(token)
console.log(documentid);

 

module.exports = async function(deployer) {
    const IpfsHttpClient = require('ipfs-http-client')
    var ipfs = await IpfsHttpClient('https://ipfs.infura.io:5001'); //for infura node

	var url=`https://api.figma.com/v1/files/${documentid}`  // to export the vectors: ?geometry=paths    
    var documentpart=(await FigmaApiGet(url,token)).document;

	ERC20TokenFactoryContract = await ERC20TokenFactory.deployed()
	
	cidTitan=await MakeImage(ipfs, "Titan",documentpart); 	
	cidTutor=await MakeImage(ipfs, "Tutor",documentpart); 	
	cidJedi=await MakeImage(ipfs, "Jedi",documentpart); 	
	cidGaia=await MakeImage(ipfs, "Gaia",documentpart); 	

	await CreateNewToken(ERC20TokenFactoryContract,"Titan",cidTitan);
	await CreateNewToken(ERC20TokenFactoryContract,"Tutor",cidTutor);
	await CreateNewToken(ERC20TokenFactoryContract,"Jedi",cidJedi);
	await CreateNewToken(ERC20TokenFactoryContract,"Gaia",cidGaia);

	NrTokens=await ERC20TokenFactoryContract.NrTokens();	
	console.log(`NrTokens=${NrTokens}`);
		
	var ERC20TokenContract=[];
	for (var i=0;i<NrTokens;i++) {
		tokenaddress=await ERC20TokenFactoryContract.tokens(i);	
		ERC20TokenContract[i] = await ERC20Token.at(tokenaddress) // don't process directly => timeouts
	}	
	for (var i=0;i<NrTokens;i++) {	   
	   name=await ERC20TokenContract[i].name()
	   tokenURI=await ERC20TokenContract[i].tokenURI()
	   console.log(`Address token ${i} ${tokenaddress} name:${name} tokenURI:${tokenURI}`)
    }
	
};

async function FigmaApiGetImageSrc(url,token) {
        var obj=await FigmaApiGet(url,token); 
        var keys = Object.keys(obj.images);
        var key=keys[0];
        var str=obj.images[key];               
        var buffer=await FigmaGetImage(str)        
        return buffer;
}
async function FigmaGetImage(url) {
	//console.log(url)
	var p1=await fetch(url)
	var buffer=await (p1).buffer()
	return buffer;    
}   



async function FigmaApiGet(url,token) { 
    var x=await fetch(url, { headers: {'X-Figma-Token': token } } );
    return await x.json()    
}

function FindObject(objname,figdata) {
//console.log(figdata);

    var firstpart = figdata.name.split(" ")[0]
	//console.log(firstpart);
    if (firstpart == objname || figdata.id==objname) 
        return figdata;
    var children=figdata.children;
    if (children)
        for (var i=0;i<children.length;i++) {
            var child=FindObject(objname,children[i] )
            if (child) return child;
        }
    return undefined; // not found        
}


async function MakeImage(ipfs, name,documentpart) {   
	var g=FindObject(name,documentpart);
	//console.log(g.id);
	var imagelink = `https://api.figma.com/v1/images/${documentid}?ids=${g.id}&format=svg`       
	var buffer=await FigmaApiGetImageSrc(imagelink,token)	
	var result= await ipfs.add(buffer)
	const image =result.path;  
	//console.log(image);
	
    var str=`
{
    "name": "${name}",
    "description": "${name} token",
    "image": "${image?"ipfs://ipfs/"+image:""}"
}
`   
    const cid = (await ipfs.add(str)).path;  
	console.log(cid);
	return cid;
}

	
	
async function CreateNewToken(contract,name,cid) {   		
	await contract.createToken(name,name,18,cid);		
    console.log(`Adding Badge ${name} cid=${cid} `)	
}

  