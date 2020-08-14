const infuraKey = "37a4c5643fe0470c944325f1e9e12d50";
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

function createBadgeElement(badgeJson, badgeId) {
    getBadgeBalance(badgeId).then((balance) => {
        var list = document.getElementById("badgeList");

        var badge = document.createElement("div");
        badge.id = badgeId.toString();
        badge.classList.add("badge-item");
        // check if student has a badge
        badge.innerHTML = `
<h1 class="badge-header"> ${badgeJson.name}</h1>
<div class="badge-image " style="background-image: url(${badgeJson.image})"></div>
<p class="badge-description">${badgeJson.description}</p>
`;

        if (parseInt(balance) === 0) {
            badge.style.opacity = 0.5;
        } else {
            badge.style.opacity = 1;
        }

        list.appendChild(badge)
    });

}

function getBadgeContent(url, badgeId) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            createBadgeElement(JSON.parse(xhr.responseText), badgeId)
        }
    };

    xhr.open('GET', url);

    xhr.send();

}

async function getBadges() {
    var totalBadges = await contract.methods.nonce().call();

    for (var i = 1; i <= totalBadges; i++) {
        var uri = await contract.methods.uri(i).call();
        getBadgeContent(uri, i);
    }
}

async function setHeaderInfo() {
    const headerInfo = document.getElementById('headerInfo');
    headerInfo.innerHTML = `(${await web3.eth.net.getNetworkType()}): ${accounts[0]}`;
}


providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: infuraKey // required
        }
    }
};

async function init() {
    web3modal = new Web3Modal.default({
        network: "rinkeby",
        providerOptions,
        theme: "dark"
    });

    web3modal.toggleModal();

    web3modal.on('connect', onConnect);
}

async function onConnect(provider) {
    web3 = new Web3(provider);
    if (await web3.eth.getChainId() != 4) {
        alert("Please connect with rinkeby network address");
    } else {
        accounts = await web3.eth.getAccounts();
        contract = await new web3.eth.Contract(contractJson.abi, contractJson.networks[4].address);
        setHeaderInfo();
        getBadges();
    }
}

document.addEventListener('DOMContentLoaded', init)
