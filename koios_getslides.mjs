import {loadScriptAsync} from './koios_util.mjs';
import {AddSlide} from './koios_showslides.mjs';

export var slides= [];

var preferredslide=0;
async function SetupIPFS() {
    console.log("In SetupIPFS");
    await Promise.all( [ // see https://www.npmjs.com/package/ipfs
       loadScriptAsync("https://unpkg.com/ipfs/dist/index.js"),
       ]
    );
   console.log("Ipfs libraries loaded");
   const ipfs = await window.Ipfs.create();
   return ipfs;
}

var ipfspromise= SetupIPFS();
   
function GetOneSlide(file) {  
    var res = file.path.split("/");
    var nums = res[1].replace(/[^0-9]/g,'');
    var num = parseInt(nums);
    slides[num]=`http://ipfs.io/ipfs/${file.path}`;
}        
   
export async function GetAllSlides() {
    console.log("In GetAllSlides");
    var cid='QmbZx57KgrMj1GfDr1XE9WnFMjJTNJFWZxsgbogBNYhrMW'; 
    var ipfs = await ipfspromise;  
    for await (const file of ipfs.ls(cid)) {
       GetOneSlide(file);
    }
}
    //var pdfurl="https://gateway.ipfs.io/ipfs/QmawzPTovb1LUPGLd7LxKRpynzA6VsqnkCa16EZmkGvjGV";
    //SetupPDFWindow("slideplayer","https://ipfs.io/ipfs/QmawzPTovb1LUPGLd7LxKRpynzA6VsqnkCa16EZmkGvjGV"); // infura doens't work well here   
    
    
//            if (preferredslide && slideimage && slides[preferredslide]) {
//            slideimage.src=slides[preferredslide]; // in case SetSlide is called before retieving the list is ready
//            preferredslide = 0;
//        }