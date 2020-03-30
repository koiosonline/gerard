
import {loadScriptAsync,LoadGapi} from './koios_util.mjs';
import {AddSlide} from './koios_showslides.mjs';

 
export var slides= [];

var preferredslide=0;


/*
var ipfspromise;

async function SetupIPFS() {
    console.log("In SetupIPFS");
    if (ipfspromise) // check if ipfs is already initialised
        return ipfspromise;
    
    await Promise.all( [ // see https://www.npmjs.com/package/ipfs
       loadScriptAsync("https://unpkg.com/ipfs/dist/index.js"),
       ]
    );
   console.log("Ipfs libraries loaded");
   ipfspromise =  window.Ipfs.create(); //await??
   return ipfspromise;
}

SetupIPFS(); // start asap

*/   
  
 
   
export async function GetAllSlides(cbFoundIndexJson) {
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString); 
// deel 1  'QmbZx57KgrMj1GfDr1XE9WnFMjJTNJFWZxsgbogBNYhrMW';     
    let cid = urlParams.get('slides') || 'QmVEyrkNVcFjbJGV4nuCfFLVqm9jrcnWdQRQ5uiop8Cvsa';
    console.log(`In GetAllSlides cid=${cid}`);
    
    var indexjson=await fetch(`https://ipfs.io/ipfs/${cid}/index.json`);        
    var slideindex=await indexjson.json();
    console.log(slideindex);
    
    slides=[]; // reset slides
    if (slideindex && slideindex.length > 0) 
        for (var i=0;i<slideindex.length;i++) 
            slides[i]=`https://ipfs.io/ipfs/${cid}/${i}.PNG`;
    
    cbFoundIndexJson(slideindex);
} 
    

/*    
        var res = file.path.split("/");
        var nums = res[1].replace(/[^0-9]/g,'');
        var num = parseInt(nums);
        
    

    GetIndexJson(cid);
    
    var ipfs = await ipfspromise;  
    for await (const file of ipfs.ls(cid)) { // for await
       GetOneSlide(file);
    }
    
}
    //var pdfurl="https://gateway.ipfs.io/ipfs/QmawzPTovb1LUPGLd7LxKRpynzA6VsqnkCa16EZmkGvjGV";
    //SetupPDFWindow("slideplayer","https://ipfs.io/ipfs/QmawzPTovb1LUPGLd7LxKRpynzA6VsqnkCa16EZmkGvjGV"); // infura doens't work well here   
    
    
//            if (preferredslide && slideimage && slides[preferredslide]) {
//            slideimage.src=slides[preferredslide]; // in case SetSlide is called before retieving the list is ready
//            preferredslide = 0;
//        }


// https://drive.google.com/drive/u/1/folders/1nrucI0Hui-nOI2xUn4iGkING8ltaNy3a
//     https://docs.google.com/presentation/d/1ph7L36NECR7XMlFoexKQFGqczbFr2RXL/edit#slide=id.p1
//     https://docs.google.com/presentation/d/1uEx52br35TxM7a_BkAaPh3OjLGT1T4Fr/edit#slide=id.p1
// https://drive.google.com/open?id=1uEx52br35TxM7a_BkAaPh3OjLGT1T4Fr
// https://slides.googleapis.com/v1/presentations/1uEx52br35TxM7a_BkAaPh3OjLGT1T4Fr?key=AIzaSyBPDSeL1rNL9ILyN2rX11FnHeBePld7HOQ ==> werkt niet (auth error)

// https://slides.googleapis.com/v1/presentations/1uEx52br35TxM7a_BkAaPh3OjLGT1T4Fr?key=AIzaSyBuEqQyEziecxBX3lEcNdTg3MGIO0y4uVo

// https://docs.google.com/presentation/d/1uEx52br35TxM7a_BkAaPh3OjLGT1T4Fr/export/pdf  ==> werkt
// https://docs.google.com/presentation/d/1uEx52br35TxM7a_BkAaPh3OjLGT1T4Fr/export/svg ==> werkt
// https://docs.google.com/presentation/d/1uEx52br35TxM7a_BkAaPh3OjLGT1T4Fr/export/svg?slide=id.p1 ==> werkt niet

// https://docs.google.com/presentation/u/1/d/1ph7L36NECR7XMlFoexKQFGqczbFr2RXL/export/svg?pageid=p3 => werkt
// https://docs.google.com/presentation/u/1/d/1ph7L36NECR7XMlFoexKQFGqczbFr2RXL/export/txt?pageid=p3 => text van alle slides

//GET https://slides.googleapis.com/v1/presentations/%5BPRESENTATIONID%5D?key=[YOUR_API_KEY] HTTP/1.1

/*
GetSlides("1uEx52br35TxM7a_BkAaPh3OjLGT1T4Fr"); 

export async function GetSlides(parentid) {
    
    console.log("In GetSlides");
    var pageToken = null;
    await LoadGapi();
    
    
  console.log("In GetSlides 2");
    
   var x=gapi.client.slides.presentations.pages.get({});
   console.log(x);
   
    var list=await gapi.client.slides.presentations.get({
        presentationId: parentid,
    });
    console.log(list)
    
    /*
    
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
    */
//}
