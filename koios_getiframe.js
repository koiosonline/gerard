// https://gpersoon.com/koios/test/koios_getiframe.js?id=course

{   // Note: is loaded multiple times, this isolates the code
    //console.log("in getiframe.js");
    
    if ( window.location == window.parent.location ) {    // e.g. not in an iframe
        const scriptDomid=document.currentScript;
        const urlObject = new URL(scriptDomid.src);
        const id = urlObject.searchParams.get('id')
        const iframe = document.createElement("iframe"); // create marker element     
        iframe.width="100%";
        iframe.height="100%";
        const idel=document.getElementById(id);
        if (idel) { // only if the field is present
            iframe.src=idel.href;
            const txt=document.createElement("div");txt.innerHTML=`Id=${id} url=${idel.href}`;scriptDomid.parentNode.appendChild(txt);
            scriptDomid.parentNode.appendChild(iframe);
            //console.log(`Loading: ${idel.href}`);       
           
        } else { // not present, so hide entire field
            //console.log(`Not present, hiding ${id}`);
            //console.log(scriptDomid.parentNode.parentNode);
            scriptDomid.parentNode.parentNode.style.display = "none"; // hide
        }
    } 
    // else console.log("Already in an iframe");    
}
