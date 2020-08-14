const infuraKey = "37a4c5643fe0470c944325f1e9e12d50";
var accounts, contract, web3, isCreator;

async function getBadgeBalance(badgeId) {
    return await contract.methods.balanceOf(accounts[0], badgeId).call();
}

function selectBadge(selectedId) {
    var badges = Array.from(document.getElementById("badgeList").children);

    badges.forEach(function (badge) {
        if (badge.id !== selectedId) {
            badge.classList.remove("badge-selected");
        } else {
            badge.classList.add("badge-selected");
        }
    });

    document.getElementById("sendBadgeForm").style.display = 'block'
}

function createBadgeElement(badgeJson, badgeId) {
    getBadgeBalance(badgeId).then((balance) => {
        var list = document.getElementById("badgeList");

        var badge = document.createElement("div");
        badge.id = badgeId.toString();
        badge.classList.add("badge-item");
        badge.addEventListener("click", function () {
            selectBadge(badge.id);
        })
        badge.innerHTML = `
<h1 class="badge-header"> ${badgeJson.name}</h1>
<div class="badge-image" style="background-image: url(${badgeJson.image})"></div>
<p class="badge-balance">(${balance})</p>
<p class="badge-description">${badgeJson.description}</p>
`
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
        var tokenCreator = await contract.methods.tokenCreator(i).call();
        // check if current account is the creator of the tokens
        if (tokenCreator === accounts[0]) {
            var uri = await contract.methods.uri(i).call();
            getBadgeContent(uri, i);
        }
    }
}

async function setHeaderInfo() {
    const headerInfo = document.getElementById('headerInfo');
    headerInfo.innerHTML = `(${await web3.eth.net.getNetworkType()}): ${accounts[0]}`;
}

async function createBadge() {
    // const form = document.getElementById("createBadgeForm");
    // var newBadge = {};
    // for (var i = 0; i < form.children.length - 1; i++) {
    //     if (form[i].localName == "input") {
    //         var key = form[i].id
    //         var value = form[i].value
    //         newBadge[key] = value;
    //     }
    // }
    //
    // for await (const result of ipfs.add(JSON.stringify(newBadge))) {
    //     console.log(result.path);
    // }

    await contract.methods.create(10).send({from: accounts[0]})
}

function log(str) {
    document.getElementById("log").innerHTML += '<p>' + str + '</p>';
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
    // ipfs = await window.Ipfs.create();

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
        isCreator = await contract.methods.creators(accounts[0]).call();
        console.log(isCreator)
        if (!isCreator) {
            window.location.href = '../student-page/student-page.html';
        }
        setHeaderInfo();
        getBadges();
    }
}

document.addEventListener('DOMContentLoaded', init)

async function sendBadge() {
    var addressess = document.getElementById("addressInput");
    var badge = document.getElementsByClassName("badge-selected");

    addressess = addressess.value.split('\n');

    addressess.forEach((address) => {
        if (!web3.utils.isAddress(address)) {
            alert(`${address} is not a valid address`);
            return;
        }
    });
    
    if (badge.length !== 0) {
        await contract.methods.sendBadges(badge[0].id, addressess).send({from: accounts[0]});
    } else {
        alert("No badge selected")
    }
}
