// https://www.koios.online/browse-links?slides=QmQ9WwsBNSZGTAiFdDPn47PfMvN3nyfMrk93tkVXp6dvW7&match=BC-3.0

import {loadScriptAsync,ipfsgetjson,subscribe,publish,DomList,GetCidViaIpfsProvider,GetCourseInfo } from './koios_util.mjs';


//import {} from './koios_getslides.mjs';
//import {} from './koios_notes.mjs';


window.addEventListener('DOMContentLoaded', asyncloaded);  // load  
    
async function asyncloaded() {  

    publish("playerloading"); // to init notes

    const urlParams = new URLSearchParams(window.location.search); 
    const parentUrlParams = new URLSearchParams(window.parent.location.search);    
    let match = urlParams.get('match') || parentUrlParams.get('match'); // if empty then matches everythng
    console.log(`In koios_browse match=${match}`);   
    let cid =  GetCourseInfo("slides") || "QmWUXkvhWoaULAA1TEPv98VUYv8VqsiuuhqjHHBAmkNw2E" //'QmRzsL6TgZcphVAHBSNaSzf9uJyqL24R945aLQocu5mT5m'; urlParams.get('slides')|| parentUrlParams.get('slides') 
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
    
    function sortfunction(a,b) {
        if (b.url && !a.url) return -1
        if (a.url && !b.url) return 1
        
        var aa= a.url || a.cid || a.pdf
        var bb= b.url || b.cid || b.pdf
        
        if (aa < bb) return -1
        if (aa > bb) return +1
        return 0;
    }
    
    slideindex.sort(sortfunction);
    
    
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
            str +=SetInfo(url,slideindex[i].title,"browse-window-frame",slideindex[i].url?false:true)+"<br>"
        }
    }          
    
 //   SetExtLink(str)  don't show the entire external tab

var prevurl=undefined
    function SetInfo(url,txt,target,fDocument) { 
        if (url == prevurl) return "";  // filter out duplicates (already sorted)
        prevurl = url;
    
        url = url.replace("http:","https:"); // to prevent error messages from browser
        var urltarget = GlobalUrlList.AddListItem()  
        
        
        var link_ext=urltarget.getElementsByClassName("link_ext")[0]
        var link_int=urltarget.getElementsByClassName("link_int")[0]
        
        if (!txt)
            txt=url
        
        var todisplay=txt // `${fDocument?"Doc":"url"}: ${txt}`
        link_int.innerHTML=todisplay
        link_int.href=url
        link_int.target=target
        
        link_int.title = txt; // hoover text to see entire link
        //urltarget.style.overflow="hidden"
        //urltarget.style.textOverflow="ellipsis"  
        link_int.style.overflow="hidden"
        link_int.style.textOverflow="ellipsis"  
        link_int.style.whiteSpace="nowrap"
  
        link_ext.href=url
        link_ext.target="_blank"
        link_ext.title=`External tab: ${txt}`
        
        var str=`<a href="${url}">${txt}</a>`
        return str;
    }    


    function SetExtLink(html) {
        var blob = new Blob([html], {type: 'text/html'});
        var url = URL.createObjectURL(blob);      
        SetInfo(url,"external","_blank",false);    
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