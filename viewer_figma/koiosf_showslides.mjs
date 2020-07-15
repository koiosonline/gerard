import {publish,subscribe,GetCidViaIpfsProvider,NrIpfsProviders,DomList,sleep,MonitorDomid,getElement} from '../lib/koiosf_util.mjs';

var SecondsArraySlides;
var prevslide=undefined;
var GlobalPrepareSlidesList; 
//var GlobalSlideIndicatorList;
var GlobalUrlList;

subscribe("playerloading",  InitShowSlides);
subscribe("foundslides",FoundSlidesViaJson) // called when sheets are found via json file

function InitShowSlides() {
    console.log("In InitShowSlides");      
    GlobalPrepareSlidesList = new DomList("real-slides")
    console.log("GlobalPrepareSlidesList")
    console.log(GlobalPrepareSlidesList)
    
    //GlobalSlideIndicatorList = new DomList("slideposition")  indicators on progress bar
    
    
   // MonitorDomid("slideplayer","w-slider-nav","w-slider-dot","w-active",SlideChanged)       
    
}




/*
subscribe("loadvideo",SlidesForVideo)    
function SlidesForVideo(vidinfo) {
    GlobalPrepareSlidesList.EmptyList()
        var match = vidinfo.txt.split(" ")[0];
    AddSlide(0,1,{title:"index",chapter:"chapter",url:`https://www.koios.online/browse-links?match=${match}`})
    
       publish("slidesloaded"); // to close init screen
    
}    
*/    
    
async function FoundSlidesViaJson(slidesarray) {
    console.log("In FoundSlidesViaJson");
    console.log(slidesarray);
    
    GlobalPrepareSlidesList.EmptyList()
    
    
/*            
    var list=""
    list +=`<a href="https://www.google.com">https://www.google.com</a><br>`
    for (var i=0;i<slidesarray.length;i++) {
       var urltarget = GlobalUrlList.AddListItem()  
       console.log(urltarget);
        urltarget.getElementsByTagName("a")[0].href=slidesarray[i].url || slidesarray[i].pdf || slidesarray[i].cid
        urltarget.getElementsByTagName("a")[0].innerHTML=slidesarray[i].title
       
       if (slidesarray[i].url) list +=`<a href=${slidesarray[i].url}>${slidesarray[i].url}</a><br>`
       if (slidesarray[i].pdf) list +=`<a href=${slidesarray[i].pdf}>${slidesarray[i].pdf}</a><br>`
       if (slidesarray[i].cid) {
           var url=GetCidViaIpfsProvider(slidesarray[i].cid,0)
           url = `https://docs.google.com/viewerng/viewer?url=${url}&embedded=true`;
            list +=`<a href=${url}>${url}</a><br>`
       }     
    }  
*/
 //AddSlide(0,1,{title:"index",chapter:"chapter",url:`https://www.koios.online/browse-links?match=BC-3.0`})
// AddSlide(0,1,{title:"index",chapter:"chapter",content:list})
    
    for (var i=0;i<slidesarray.length;i++) 
          AddSlide(i,slidesarray.length,slidesarray[i])

  //  await sleep(100); // wait a little while, otherwise redraw doesn't work
   // var x= Webflow.require('slider').redraw(); //////////////////////////////////////////////////////////////// regenerate the dots    
    
    var domid=getElement("slideplayer");
    if (domid) {
        var dots=domid.getElement("w-slider-dot")
        for (var i=0;i<dots.length;i++)
            dots[i].id=`dot-${i+1}`;
        
    }
   publish ("slidesloaded");
   
   
    prevslide=undefined;
    SetSlide(undefined); // update all info about first slide
}    

function AddSlide(num,total,slidesinfo) {
    
    console.log(`In AddSlide ${num} ${slidesinfo.png} ${slidesinfo.title}`);
    
    var ipfsproviderindex=0;    
    function urlerrorhandling() {
        if (ipfsproviderindex++ >= NrIpfsProviders() ) {
            this.onerror =  null; // no more options
        } else
            this.src=GetCidViaIpfsProvider(slidesinfo.png,ipfsproviderindex);        
        console.log(`In urlerrorhandling for cid ${slidesinfo.png} ipfsproviderindex ${ipfsproviderindex}`);
    }    
    if (slidesinfo.png) {
        var url=GetCidViaIpfsProvider(slidesinfo.png,0);    
        var target = GlobalPrepareSlidesList.AddListItem()
        console.log("GlobalPrepareSlidesList")
        console.log(GlobalPrepareSlidesList)
        console.log(target)
        if (target) {
            target.getElementsByTagName("img")[0].src=url;
            target.getElementsByTagName("img")[0].onerror=urlerrorhandling;
            target.style.display="";
        }
    }
}
         //   var a=target.getElement("href-button")[0];
         //   a.href=url;
         //   a.target="_blank"
/*        if (slidesinfo.pdf) {
           SetupPDFWindowGoogle(target,slidesinfo.pdf);            
        }    
        if (slidesinfo.url)  {
            SetupURL(target,slidesinfo.url);
        }
        
      
*/        
       // target.getElementsByTagName("h5")[0].innerHTML=`Slide #${num+1} of ${total} ${slidesinfo.chapter} ${slidesinfo.title}`;
    




 
     
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
        
        
        //var a=sf.getElement("href-button")[0];
        //a.href=url
        //a.target="_blank"
        
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
        
        //var a=sf.getElement("href-button")[0];
        
        url = url.replace("http:", "https:"); // to prevent error message Mixed Content: The page at '<URL>' was loaded over HTTPS, but requested an insecure frame '<URL>'
        
        console.log(url);
        
        //a.href=url
        //a.target="_blank"
        
        var ifrm=document.createElement("iframe");
        var fLoaded=false;
        ifrm.style.width = "100%";
        ifrm.style.height = "100%";   
        sf.appendChild(ifrm);
        ifrm.src=url;        
    }








export async function FoundSlides(sheets,vidinfo) {           // found slide info via subtitles   
 //GlobalSlideIndicatorList.EmptyList();
console.log("In FoundSlides");
console.log(sheets);
console.log(vidinfo);
    var duration = vidinfo.duration;
    if (sheets) {
        
        for (var i=0;i<sheets.length;i++) {
            var nums = sheets[i].text.replace(/[^0-9]/g,'');
            var num = parseInt(nums);
            //AddSlide(num,slides[num],"");
            
            console.log(`In FoundSlides ${i}`);
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
    console.log(`In SetSlideIndicator ${xposperc} ${lengthperc}`);
   // var cln = GlobalSlideIndicatorList.AddListItem();
    //cln.style.left= (xposperc*100)+"%";
    //cln.style.width= (lengthperc*100)+"%";
    //cln.title=`Slide: ${slidenr}`;
}    



export function UpdateSlide(CurrentPos) {   // called frequently
   if (SecondsArraySlides) {
      var res=SecondsArraySlides[ parseInt(CurrentPos)]
      SetSlide(res);
   } 
}


async function SetSlide(n) {    // n starts at 1
    console.log(`In SetSlide ${n} ${prevslide} ${n==prevslide}`);
    //if (!n) n=0; // show the first slide
    if (n == prevslide) 
        return; // not changed
    
    console.log("Still in SetSlide")
    prevslide=n;
    if (n != undefined) {
        var dot=getElement(`dot-${n}`)
        if (dot)
            dot.click();   // select the right slide ==> calls function SlideChanged
    }
    
     publish("slideselected",n==undefined? n : n-1);
    
} 


function SlideChanged(childdomid,childnr) { // childnr starts at 0
    console.log(`In function SlideChanged ${childnr}`);
       publish("slideselected",childnr);
} 
