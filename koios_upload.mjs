

import {uploadYtDataToIpfs,getYtInfoIpfs,includeSubtitlesforIpfsExport} from './koios_ipfs.mjs';
import {LinkClickButton,subscribe} from './koios_util.mjs';
import {SetupLogWindow,log} from './koios_log.mjs';


console.log("Hello koios_upload");
  
  SetupLogWindow(false)
    LinkClickButton("startprocess");subscribe("startprocessclick",startprocess);
    
    
async function startprocess() {
    log("startprocess");
   // log(uploadYtDataToIpfs())
    
    
    //var x=await getYtInfoIpfs("QmWRpcQt5wn49rAKrBE1NBEqEvoEd7c7XTALrDryJKwUqA");
    var x=await uploadYtDataToIpfs();
    for (var i=0;i<x.length;i++)
        log(x[i]);
    
    
    //log(includeSubtitlesforIpfsExport() )
}

 