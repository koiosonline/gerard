// https://www.koios.online/browse-links?slides=QmQ9WwsBNSZGTAiFdDPn47PfMvN3nyfMrk93tkVXp6dvW7&match=BC-3.0

import {loadScriptAsync,LoadGapi,ipfsgetjson,subscribe,publish,DomList,GetCidViaIpfsProvider } from './koios_util.mjs';
import {} from './koios_getslides.mjs';


window.addEventListener('DOMContentLoaded', asyncloaded);  // load  
    
async function asyncloaded() {  
    const urlParams = new URLSearchParams(window.location.search); 
    const parentUrlParams = new URLSearchParams(window.parent.location.search);    
    let match = urlParams.get('match') || parentUrlParams.get('match'); // if empty then matches everythng
    console.log(`In koios_browse match=${match}`);   
    let cid = urlParams.get('slides') || parentUrlParams.get('slides') || "QmWUXkvhWoaULAA1TEPv98VUYv8VqsiuuhqjHHBAmkNw2E" //'QmRzsL6TgZcphVAHBSNaSzf9uJyqL24R945aLQocu5mT5m';
    console.log(`In koios_browse cid=${cid}`);
   
    var domid=document.getElementById("browse-window");
    var iframe=document.createElement("iframe");
    iframe.width="100%"
    iframe.height="100%"
    iframe.name="browse-window-frame"
    domid.appendChild(iframe);
   
    var slideindex = await ipfsgetjson(cid);        
    var GlobalUrlList = new DomList("browser-url") // before real-slides (because is child)  
    var str=""    
    for (var i=0;i<slideindex.length;i++) {
        if (match && slideindex[i].chapter !== match) 
            continue; // ignore
            
        var url = slideindex[i].url 
        if (!url && slideindex[i].cid) {
            url = slideindex[i].cid
            url = GetCidViaIpfsProvider(slideindex[i].cid,0)
            url = `https://docs.google.com/viewerng/viewer?url=${url}&embedded=true`;
        }
        if (!url && slideindex[i].pdf) {                
            url = slideindex[i].pdf
            url = `https://docs.google.com/viewerng/viewer?url=${url}&embedded=true`;
        }    
        if (url) {
            url = url.replace("http:", "https:");
            str +=SetInfo(url,slideindex[i].title,"browse-window-frame")+"<br>"
        }
    }          
    
    SetExtLink(str)


    function SetInfo(url,txt,target) {
        var urltarget = GlobalUrlList.AddListItem()  
        var domid=urltarget.getElementsByTagName("a")[0]
        
        domid.innerHTML=txt
        domid.href=url
        domid.target=target
        
        var str=`<a href="${url}">${txt}</a>`
        return str;
    }    


    function SetExtLink(html) {
        var blob = new Blob([html], {type: 'text/html'});
        var url = URL.createObjectURL(blob);      
        SetInfo(url,"external","_blank");    
    }    

}


// <a href="https://www.thesitewizard.com/" rel="noopener noreferrer" target="_blank">thesitewizard.com</a>
/*
    function notifyparent() {    
        console.log(`notifyparent ${url}`)    
        window.parent.postMessage(url,"*")       
    }

    domid.onclick=notifyparent;

window.addEventListener("message", receiveMessage, false);
function receiveMessage(event)
{  if (event.origin != "https://www.koios.online")
      return; // ignore other events
    console.log(event);
    var logtext=document.getElementById("notes");
 
 
     if (logtext)
        logtext.innerHTML +=event.data+"\r";
    
    logtext.scrollTop = logtext.scrollHeight; // keep the windows "scrolled down"
}


  if (slidesinfo.content)  {            
            var ifrm=document.createElement("iframe");       
            ifrm.width = "100%";
            ifrm.height = "100%";   
            ifrm.style.width = "100%";
            ifrm.style.height = "100%";   
                      
            target.appendChild(ifrm);
        }

*/