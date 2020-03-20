console.log(`In ${window.location.href} starting script: ${import.meta.url}`);

import {LoadGapi,InsertIFrame} from './koios_util.mjs';


// See https://developers.google.com/drive/api/v3/search-files
// enable drive via: https://console.developers.google.com/apis/api/drive.googleapis.com/overview 
// enable youtube via: https://console.developers.google.com/apis/library/youtube.googleapis.com 
// enable apis: https://console.developers.google.com/apis/dashboard
// note drive files have to be share to everyone


var resultlist=[]


export async function GetDrive(parentid) {
    var pageToken = null;
    await LoadGapi();
    var list=await gapi.client.drive.files.list({
        q: `'${parentid}' in parents`,
        pageSize: 100,
        fields: "files(id, name,webViewLink,mimeType)", // 'nextPageToken, files(id, name)',  // get all fields                
    });
    //console.log(list.result.files);
    //console.log(list.result.files[0]);
    const files = list.result.files;
    if (files.length) {
      //console.log('Files:');
      files.map((file) => {
        
        if (file.mimeType =="application/vnd.google-apps.folder") // then it's a folder
           GetDrive(file.id); // recursive call
        else {// now it's a file 
           //console.log(`${file.name}  -  ${file.webViewLink}`);
           var result={};
           result.name      = file.name;
           result.url       =  file.webViewLink;
           resultlist.push(result)           
        }
      });
    }
}

GetDrive("1cUv5yOMxPnb9AAJCt22GD6jkev0IoWye");   // studenten materiaal
//console.log(resultlist);

var litdomid;
var assdomid;

export function SetupLitAndAss() {
    
     litdomid = InsertURL("literature","");
     assdomid = InsertURL("quiz","");
     console.log("In SetupLitAndAss");
       console.log(litdomid);
    console.log(assdomid);
}    

export async function GetSetupLitAndAssInfo(title) {
    
    title = title.replace("BC-", "");
    title = title.split(" ")[0];
    console.log(`GetDriveInfo ${title}`);
    

    function FindLiterature(line) { 
        return line.name.includes(title) && !line.name.includes("Assessment");
    }

    function FindAssessment(line) { 
        return line.name.includes(title) && line.name.includes("Assessment");
    }

    
    var lit=resultlist.find(FindLiterature);     
    var ass=resultlist.find(FindAssessment);     
    console.log(lit);
    console.log(ass);
                                      // note embedding doesn't work
    litdomid.href=lit.url;
    litdomid.innerHTML = lit.name;    
    assdomid.href=ass.url;
    assdomid.innerHTML = ass.name;    
    console.log(litdomid);
    console.log(assdomid);
}    


function InsertURL(windowid,url) {
   var domid=document.getElementById(windowid);   
   console.log(domid);
   var a=document.createElement("a");
    a.href=url;
    a.innerHTML="link";
    a.target="_blank";
    domid.appendChild(a);
    console.log("In InsertURL");
    console.log(a);
    return a;
}
