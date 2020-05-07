import {}  from "https://unpkg.com/web3@latest/dist/web3.min.js"; // {Web3}

let web3;
let currentChainId;
let currentUserAddress;

export async function authorize() {
  // Check if metamask or other is installed
  if (typeof window.ethereum !== undefined) {
    try {
      // Ask user to allow usage of ethereum account
      await window.ethereum.enable()
    } catch {
      window.alert("Without Metamask this is not going to work");
      return
    }

    // Setup listeners for chain or account changes
    window.ethereum.on('chainIdChanged', (id) => {setChainId(id)});
    window.ethereum.on('accountsChanged', (address) => {setUserAddress(address[0])});

    // Disable refresh on network change, will be default in future
    window.ethereum.autoRefreshOnNetworkChange = false;

    return await initializeWeb3();
  } else {
    // Show error when no metamask is found
    window.alert("Metamask should be installed to use this page!");
  }
}

// Initialize web3
export async function initializeWeb3() {
  web3 = new Web3(Web3.givenProvider); // web3->Web3
  currentChainId = await web3.eth.net.getId();
  let addressess = await web3.eth.getAccounts();
  currentUserAddress = addressess[0];
}

export async function initializeContract(abi, contractAddress) {
  if (!web3) throw 'Web3 not initialized';
  let contractInstance = await new web3.eth.Contract(abi, contractAddress);
  return contractInstance;
}

export function getUserAddress() {
  return currentUserAddress;
}

export function getWeb3() {
  return web3;
}

function setChainId(chainId) {
  currentChainId = chainId;
}

function setUserAddress(userAddress) {
  currentUserAddress = userAddress;
}
