
import {loadScriptAsync,LoadGapi,ipfsgetjson,subscribe,publish} from './koios_util.mjs';




subscribe("loadvideo",GetSlidesFromVideo)

function GetSourceCid() {    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString); 
    let cid = urlParams.get('slides') || 'QmRzsL6TgZcphVAHBSNaSzf9uJyqL24R945aLQocu5mT5m';
    console.log(`In GetSourceCid cid=${cid}`);
    return cid;
}    

var oldcid;
var slideindex;

async function GetSlidesFromVideo(vidinfo) {    
    console.log("In GetSlidesFromVideo");
    console.log(vidinfo);
    var cid=GetSourceCid();
    if (cid != oldcid)
        slideindex = await ipfsgetjson(cid);
    var match = vidinfo.txt.split(" ")[0];
    var showslides=[]        
    for (var i=0;i<slideindex.length;i++) 
        if (slideindex[i].chapter === match) 
            showslides.push(slideindex[i])
    publish("foundslides",showslides);
}    

