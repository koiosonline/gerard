import {publish,subscribe} from './koios_util.mjs';


// subscribe("playerloading",  InitAbout);  // disabled

 


var globalIframe
function InitAbout() {
    console.log("In InitAbout");        
    var domid=document.getElementById("about");
    var iframe=document.createElement("iframe");
    iframe.width="100%"
    iframe.height="90vh"
    iframe.style.width="100%"
    iframe.style.height="90vh"
    iframe.src="https://www.koios.online/#about2"
    domid.appendChild(iframe); 
    globalIframe=iframe;
    
    
    var domidver=document.getElementById("version");
    domid.appendChild(domidver)
    
}
 