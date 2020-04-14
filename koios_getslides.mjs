
import {loadScriptAsync,LoadGapi,ipfsgetjson} from './koios_util.mjs';
import {AddSlide} from './koios_showslides.mjs';

 
export var slides= [];

var preferredslide=0;


export async function GetAllSlides(cbFoundIndexJson) {
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString); 
    let cid = urlParams.get('slides') || 'QmRzsL6TgZcphVAHBSNaSzf9uJyqL24R945aLQocu5mT5m';
    console.log(`In GetAllSlides cid=${cid}`);
    
    var slideindex = await ipfsgetjson(cid);
    console.log(slideindex);
    
    slides=[]; // reset slides
    if (slideindex && slideindex.length > 0) 
        for (var i=0;i<slideindex.length;i++) {       
            slides[slideindex[i].slidenr]=slideindex[i].png; // `https://ipfs.io/ipfs/${slideindex[i].png}`;
        }
    cbFoundIndexJson(slideindex);   
} 

