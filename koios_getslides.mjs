
import {loadScriptAsync,ipfsgetjson,subscribe,publish,GetCourseInfo} from './koios_util.mjs';




subscribe("loadvideo",GetSlidesFromVideo)

function GetSourceCid() {    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString); 
    let cid = GetCourseInfo("slides")  || "QmWUXkvhWoaULAA1TEPv98VUYv8VqsiuuhqjHHBAmkNw2E" //'QmXzRAXrFUou1FWHBMUvbb66bT8xfToQH3HJWqUNhTiXLX' // 'QmRzsL6TgZcphVAHBSNaSzf9uJyqL24R945aLQocu5mT5m'; urlParams.get('slides')
    console.log(`In GetSourceCid cid=${cid}`);
    return cid;
}    

var oldcid;
var slideindex;

async function GetSlidesFromVideo(vidinfo) {    
   // console.log("In GetSlidesFromVideo");
  //  console.log(vidinfo);
    var cid=GetSourceCid();
    if (cid != oldcid)
        slideindex = await ipfsgetjson(cid);
    var match = vidinfo.txt.split(" ")[0];
    var showslides=[]        
    for (var i=0;i<slideindex.length;i++) 
        if ((slideindex[i].chapter === match) && (slideindex[i].png) ) 
            showslides.push(slideindex[i])
    publish("foundslides",showslides);
}    

