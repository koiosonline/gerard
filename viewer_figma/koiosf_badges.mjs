 import {GetJson,subscribe,DomList,setElementVal,GetJsonIPFS,GetImageIPFS} from '../lib/koiosf_util.mjs';
import {getWeb3} from './koiosf_login.mjs'
 
 
var accounts, contract, web3, isCreator;


async function getBadgeBalance(badgeId) {
    return await contract.methods.balanceOf(accounts[0], badgeId).call();
}

async function reloadBadges() {
    var totalBadges = await contract.methods.nonce().call();

    for (var i = 1; i <= totalBadges; i++) {
        var balance = await contract.methods.balanceOf(accounts[0], i).call();
        var badge = document.getElementById(i.toString())

        if (badge !== undefined) {
            if (parseInt(balance) === 0) {
                badge.style.opacity = 0.5;
            } else {
                badge.style.opacity = 1;
            }
        }
    }
}
 

var GlobalBadgeList;

 

async function getBadges() {
    console.log("In getBadges");
     GlobalBadgeList.EmptyList()    


    var totalBadges =   await contract.methods.balanceOf(accounts[0]).call();
    console.log(`totalBadges=${totalBadges}`)
    // await contract.methods.nonce().call();
    
 //   tokenOfOwnerByIndex
    

    for (var i = 1; i <= totalBadges; i++) {
        var urltarget = GlobalBadgeList.AddListItem() 
        GetBadgeDetails(urltarget,i)
    }
}
 // images are loaded from https://cloudflare-ipfs.com/ipfs/..  (svg doesn't allways work)


async function GetBadgeDetails(urltarget,i) { // put in function to be able to run in parallel
        var tokenid = await contract.methods.ownedTokens(accounts[0],i-1).call(); // should be tokenOfOwnerByIndex
      //  console.log(`tokenid=${tokenid}`)
        var uri = await contract.methods.tokenURI(tokenid).call();
     //   console.log(uri)        
        var badgecontent=await GetJsonIPFS(uri)
      //  console.log(badgecontent);
        if (badgecontent) {
        //getBadgeContent(uri, i);
            if (badgecontent.image) {
                 var imageobject=await GetImageIPFS(badgecontent.image)
                 setElementVal("__icon",imageobject,urltarget)
            }        
            setElementVal("__label",badgecontent.name+" "+badgecontent.description,urltarget)
           // console.log(urltarget);
        }
}        


 
  var contractJson

//https://gpersoon.com/koios/lib/smartcontracts/build/contracts/KOIOSNFT.json
async function init() {
    
    let params = (new URL(document.location)).searchParams;
    let idvalue= params.get("smartcontractinfo"); 
    
    var smartcontractinfo="https://koiosonline.github.io/lib/smartcontracts/build/contracts/KOIOSNFT.json"
    if (idvalue)
        smartcontractinfo=idvalue;
    
    
    contractJson=await GetJson(smartcontractinfo)
    
    console.log(contractJson);
    
    subscribe("web3providerfound",NextStep)
    
    GlobalBadgeList = new DomList("badge")
    
}

async function NextStep() {
    console.log("In NextStep");
    web3=getWeb3()
    var nid=(await web3.eth.net.getId());
    accounts = await web3.eth.getAccounts();
        
    var code=await web3.eth.getCode(contractJson.networks[nid].address)
    console.log(code);
    
    if (code.length <=2) {       
        console.error("No contract code");
        return;
    }
    contract = await new web3.eth.Contract(contractJson.abi, contractJson.networks[nid].address);
    console.log(contract);
    getBadges();
      
}    

    

document.addEventListener('DOMContentLoaded', init)
