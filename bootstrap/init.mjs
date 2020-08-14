console.log(`In ${window.location.href} starting script: ${import.meta.url}`);
console.log("This is init.mjs, located at https://koiosonline.github.io/lib/bootstrap/init.mjs")
// http://gpersoon.com/koios/lib/bootstrap/test.html
// dnslink=/ipfs/QmZEgAo2Su99vcSwCf14AGokucaPCcshxr8zK3fZ5fKjf5
// https://ipfs.io/ipns/koios.online
// https://ipfs.io/ipns/viewer.koios.online
// https://ipfs.io/ipns/viewer.test.koios.online
// c:\bin\dig +noall +answer TXT _dnslink.koios.online
// c:\bin\dig +noall +answer TXT _dnslink.viewer.koios.online
// c:\bin\dig +noall +answer TXT _dnslink.viewer.test.koios.online

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function start() { 
	let url = (new URL(document.location));
	console.log(url)
    var split=url.pathname.split("/");
	console.log(split)
	var last=split[split.length-1]
	var beforelast=split[split.length-2]
	console.log(beforelast,last);
	
	var cid=url.searchParams.get("ipfs");   	
	if (!cid) {	
		var prod="https://koiosonline.github.io/lib/bootstrap"
		var test="https://gpersoon.com/koios/gerard/bootstrap"
		var cidlocation=(beforelast=="test")?test:prod;
		var cidfile="viewer"
		switch (last) {
			case "viewer.test.koios.online": cidlocation=test;break;
			case "viewer.koios.online": 	 cidlocation=prod;break;
			case "newviewer": break;
			case "homepage": cidfile="homepage";break;						  							  
		}
		var loadfile=cidlocation+"/"+cidfile
		console.log(`Loading config file ${loadfile}`)
		cid=(await (await fetch(loadfile)).text()).trim();
	}
	console.log(cid)		
    var iframe=document.createElement("iframe");
    iframe.src="https://ipfs.io/ipfs/"+cid
    iframe.width="100%"
    iframe.height="100%"
    iframe.style.height="100%"
    iframe.style.minHeight="100%" 
    iframe.style.position="fixed";
    iframe.style.top="0";
    iframe.style.left="0";
	console.log(`Loading ${iframe.src}`);
    document.body.appendChild(iframe);    	
	for (var i=0;i<10;i++) { // give it a few tries; iframe needs to be loaded first		
		console.log(`Send ${url.href}`)
		iframe.contentWindow.postMessage(url.href+"&"+i, "*"); // 'https://ipfs.io');
		await sleep(1000)
	}
}

start();

