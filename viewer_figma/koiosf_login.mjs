


import {loadScriptAsync,getElement,GetImageIPFS} from '../lib/koiosf_util.mjs';
import { } from "../lib/3box.js"; // from "https://unpkg.com/3box/dist/3box.js"; // prevent rate errors

/*

const infuraKey = "37a4c5643fe0470c944325f1e9e12d50";
var providerOptions = {
/*    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: infuraKey // required
        }
    }
    
};

*/


let web3Modal     // Web3modal instance
var  provider;  // Chosen wallet provider given by the dialog window
let selectedAccount;     // Address of the selected account


var initpromise=init();

async function init() {
     await Promise.all(
        [
        await loadScriptAsync("https://unpkg.com/web3@latest/dist/web3.min.js"),
        await loadScriptAsync("https://unpkg.com/web3modal"),        
        await loadScriptAsync("https://unpkg.com/evm-chains/lib/index.js"),        
        await loadScriptAsync("https://unpkg.com/@walletconnect/web3-provider@latest/dist/umd/index.min.js"),
        await loadScriptAsync("https://cdn.jsdelivr.net/npm/fortmatic@latest/dist/fortmatic.js"),        // https://unpkg.com/fortmatic@2.0.6/dist/fortmatic.js
        ])
    console.log("After promise all");
}    

if (window.ethereum)
    window.ethereum.autoRefreshOnNetworkChange=false; // prevent autoreload


export async function Login() {
    console.log("login");
    await initpromise;
   

    const Web3Modal = window.Web3Modal.default;
    const WalletConnectProvider = window.WalletConnectProvider.default;
    const EvmChains = window.EvmChains;
    const Fortmatic = window.Fortmatic;



    console.log("Initializing example");
    console.log("WalletConnectProvider is", WalletConnectProvider);
    console.log("Fortmatic is", Fortmatic);

      // Tell Web3modal what providers we have available.
      // Built-in web browser provider (only one can exist as a time)
      // like MetaMask, Brave or Opera is added automatically by Web3modal
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            // Mikko's test key - don't copy as your mileage may vary
            infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
          }
        },

        fortmatic: {
          package: Fortmatic,
          options: {            
            key: "pk_test_C80030486E9F6B17"
          }
        }
      };

      web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions, // required
      });

onConnect();

}


/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider);

  console.log("Web3 instance is", web3);




  // Get connected chain id from Ethereum node
  const chainId = await web3.eth.getChainId();
  // Load chain information over an HTTP API
  const chainData = await EvmChains.getChain(chainId);
  getElement("chain").textContent = chainData.name;

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();

  // MetaMask does not give you all accounts, only the selected account
  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];

  getElement("account").textContent = selectedAccount;


// Read profile data
const profile = await Box.getProfile(selectedAccount)
console.log(profile)
if (profile) {
    getElement("name").textContent = profile.name + " " + profile.emoji
    var imagecid=profile.image[0].contentUrl
    imagecid=imagecid[`\/`]
//    .["/"]
    console.log(imagecid);
    getElement("userphoto ").src=await GetImageIPFS(imagecid)
}    

  // Get a handl
 //const template = document.querySelector("#template-balance");
  //const accountContainer = document.querySelector("#accounts");

  // Purge UI elements any previously loaded accounts
  //accountContainer.innerHTML = '';

  // Go through all accounts and get their ETH balance
  const rowResolvers = accounts.map(async (address) => {
    const balance = await web3.eth.getBalance(address);
    // ethBalance is a BigNumber instance
    // https://github.com/indutny/bn.js/
    const ethBalance = web3.utils.fromWei(balance, "ether");
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
    // Fill in the templated row and put in the document
    //const clone = template.content.cloneNode(true);
    //clone.querySelector(".address").textContent = address;
    //clone.querySelector(".balance").textContent = humanFriendlyBalance;
    //accountContainer.appendChild(clone);
  });

  // Because rendering account does its own RPC commucation
  // with Ethereum node, we do not want to display any results
  // until data for all accounts is loaded
  await Promise.all(rowResolvers);

  // Display fully loaded UI for wallet data
  //document.querySelector("#prepare").style.display = "none";
  //document.querySelector("#connected").style.display = "block";
}



/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {

  // If any current data is displayed when
  // the user is switching acounts in the wallet
  // immediate hide this data
 //.document.querySelector("#connected").style.display = "none";
  //document.querySelector("#prepare").style.display = "block";

  // Disable button while UI is loading.
  // fetchAccountData() will take a while as it communicates
  // with Ethereum node via JSON-RPC and loads chain data
  // over an API call.
 // document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
  //document.querySelector("#btn-connect").removeAttribute("disabled")
}


/**
 * Connect wallet button pressed.
 */
async function onConnect() {

  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

console.log(provider);
  // Subscribe to accounts change
  
  try {
      provider.on("accountsChanged", (accounts) => {
        fetchAccountData();
      });

      // Subscribe to chainId change
      provider.on("chainChanged", (chainId) => {
        fetchAccountData();
      });

      // Subscribe to networkId change
      provider.on("networkChanged", (networkId) => {
        fetchAccountData();
      });
  } catch(e) {
    console.log("provider on error", e);
    return;
  }
  
  await refreshAccountData();
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {

  console.log("Killing the wallet connection", provider);

  // TODO: Which providers have close method?
  if(provider.close) {
    await provider.close();

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider();
    provider = null;
  }

  selectedAccount = null;

  // Set the UI back to the initial state
 // document.querySelector("#prepare").style.display = "block";
  //document.querySelector("#connected").style.display = "none";
}


    

 

 