import {publish,subscribe,GetCidViaIpfsProvider,NrIpfsProviders,DomList,sleep} from './koios_util.mjs';

var SecondsArraySlides;
var prevslide=0;
var GlobalPrepareSlidesList; 
var GlobalSlideIndicatorList;

subscribe("playerloading",  InitShowSlides);
subscribe("foundslides",FoundSlidesViaJson) // called when sheets are found via json file


// subscribe("loadvideo",)

function InitShowSlides() {
    console.log("In InitShowSlides");    
    GlobalPrepareSlidesList = new DomList("real-slides")
    //GlobalPrepareSlidesList.EmptyList()
   
    GlobalSlideIndicatorList = new DomList("slideposition")
    //GlobalSlideIndicatorList.EmptyList();
}
    
function FoundSlidesViaJson(slidesarray) {
    console.log("In FoundSlidesViaJson");
    console.log(slidesarray);
    
    GlobalPrepareSlidesList.EmptyList()
    GlobalSlideIndicatorList.EmptyList();
    
    for (var i=0;i<slidesarray.length;i++)
       AddSlide(i,slidesarray.length,slidesarray[i])
   
    Webflow.require('slider').redraw(); // regenerate the dots    
    var domid=document.getElementById("slideplayer");
    var dots=domid.getElementsByClassName("w-slider-dot")
    for (var i=0;i<dots.length;i++)
        dots[i].id=`dot-${i+1}`;
    publish ("slidesloaded");          
}    

async function AddSlide(num,total,slidesinfo) {
    
    console.log(`In AddSlide ${num} ${slidesinfo.png} ${slidesinfo.title}`);
    
    var ipfsproviderindex=0;    
    function urlerrorhandling() {
        if (ipfsproviderindex++ >= NrIpfsProviders() ) {
            this.onerror =  null; // no more options
        } else
            this.src=GetCidViaIpfsProvider(slidesinfo.png,ipfsproviderindex);        
        console.log(`In urlerrorhandling for cid ${slidesinfo.png} ipfsproviderindex ${ipfsproviderindex}`);
    }    
    
    var target = GlobalPrepareSlidesList.AddListItem()
    if (target) {
        if (slidesinfo.png) {
            var url=GetCidViaIpfsProvider(slidesinfo.png,0);
            target.getElementsByTagName("img")[0].src=url;
            target.getElementsByTagName("img")[0].onerror=urlerrorhandling;
            var a=target.getElementsByClassName("href-button")[0];
            a.href=url;
            a.target="_blank"
        }
        if (slidesinfo.pdf) {
           SetupPDFWindowGoogle(target,slidesinfo.pdf);            
        }    
        if (slidesinfo.url)  {
            SetupURL(target,slidesinfo.url);
        }
        target.getElementsByTagName("h5")[0].innerHTML=`Slide #${num+1} of ${total} ${slidesinfo.chapter} ${slidesinfo.title}`;
        target.style.display="";
    }
}




 
     
     async function SetupPDFWindowGoogle(sf,pdfurl) {  // laadt soms niet, zeker als er al een tweede windows openstaat
        console.log("In SetupPDFWindowGoogle");
        var ifrm=document.createElement("iframe");
        var fLoaded=false;
        ifrm.style.width = "100%";
        ifrm.style.height = "100%";   
        sf.appendChild(ifrm);
        var url=`https://docs.google.com/viewerng/viewer?url=${pdfurl}&embedded=true`;
        ifrm.src=url;        
        ifrm.addEventListener('load', e => { fLoaded=true } );
        
        
        var a=sf.getElementsByClassName("href-button")[0];
        a.href=url
        a.target="_blank"
        
        for (var i=0;i<5;i++) { // try 5 times
            await sleep (5000);
            if (!fLoaded) {
                console.log(`Retry loading ${url}`);
                ifrm.src=null;
                ifrm.src=url;
            }
        } 
    }

  
     async function SetupURL(sf,url) {   
        console.log("In SetupURL");
        
        var a=sf.getElementsByClassName("href-button")[0];
        a.href=url
        a.target="_blank"
        
        var ifrm=document.createElement("iframe");
        var fLoaded=false;
        ifrm.style.width = "100%";
        ifrm.style.height = "100%";   
        sf.appendChild(ifrm);
        ifrm.src=url;        
    }




export async function FoundSlides(sheets,vidinfo) {           // found slide info via subtitles   
    var duration = vidinfo.duration;
    if (sheets) {
        for (var i=0;i<sheets.length;i++) {
            var nums = sheets[i].text.replace(/[^0-9]/g,'');
            var num = parseInt(nums);
            //AddSlide(num,slides[num],"");
            SetSlideIndicator(num,parseFloat(sheets[i].start) / duration,parseFloat(sheets[i].dur) / duration)
        }          
        SecondsArraySlides=SlidesToSeconds(sheets);
    }    
}    

function SlidesToSeconds(sheets) {
    var Seconds=[];
    for (var j=0;j < sheets.length;j++) {
         var subline=sheets[j];
         var s=parseInt(subline.start);
         var e=parseInt(parseFloat(subline.start)+parseFloat(subline.dur));  
        var nums = sheets[j].text.replace(/[^0-9]/g,'');
        var num = parseInt(nums);         
     
     //var num=j+1;
        for (var k=s; k< e;k++)
             Seconds[k]=num;
     }
     //console.log("In SlidesToSeconds");
     //console.log(Seconds);
     return Seconds;
}



function SetSlideIndicator(slidenr,xposperc,lengthperc) {
  //  console.log(`In SetSlideIndicator ${xposperc} ${lengthperc}`);
    var cln = GlobalSlideIndicatorList.AddListItem();
    cln.style.left= (xposperc*100)+"%";
    cln.style.width= (lengthperc*100)+"%";
    cln.title=`Slide: ${slidenr}`;
}    



export function UpdateSlide(CurrentPos) {   // called frequently
   if (SecondsArraySlides) {
      var res=SecondsArraySlides[ parseInt(CurrentPos)]
      SetSlide(res);
   } 
}


async function SetSlide(n) {    
    if (!n) n=0; // show the first slide
    if (n == prevslide) 
        return; // not changed
    prevslide=n;
    var dot=document.getElementById(`dot-${n}`)
    if (dot)
        dot.click();   // select the right slide
} 



 


