  //if (setofsheets) ******************************************************************
//       SetupSlideIndicators();


import {GetAllSlides,slides} from './koios_getslides.mjs';





var slideimage;


var PrepareSlidesListTemplate;
var PrepareSlidesListParent;
var SlideIndicatorTemplate;
var SlideIndicatorParent;

var SecondsArraySlides;

var prevslide=0;

export async function SetupSlideWindow(windowid) {
    console.log("In SetupSlideWindow");
    var slidewindow=document.getElementById(windowid);
    slideimage=document.createElement("img");
    
    slideimage.style.width = "100%";
    slideimage.style.height = "100%"; 
    slidewindow.appendChild(slideimage);
    SetSlide(undefined);
}



function PrepareSlidesList() {
    console.log("In PrepareSlidesList");
    var list = document.getElementsByClassName("list-slides");
    //console.log(list)    
    if (list && list[0]) {
        PrepareSlidesListTemplate = list[0];        
        PrepareSlidesListParent   = list[0].parentNode
        list[0].remove();
    } else
        console.error("list-slides not found");
    
    PrepareSlidesList = function(){} // next time do nothing
}    


export async function AddSlide(url) {
    PrepareSlidesList()
    var cln = PrepareSlidesListTemplate.cloneNode(true);
    PrepareSlidesListParent.appendChild(cln);
    cln.src=url;
}


var promiseGetAllSlides;




export async function FoundSlides(sheets,duration) {
    
    await promiseGetAllSlides; // wait till slide info from IPFS is ready
    console.log(`In FoundSlides`);
    console.log(sheets);
    //await slidepromise; // now we have the slides
    for (var i=0;i<sheets.length;i++) {
        var nums = sheets[i].text.replace(/[^0-9]/g,'');
        var num = parseInt(nums);
        AddSlide(slides[num]);
        
        
        SetSlideIndicator(num,parseFloat(sheets[i].start) / duration,parseFloat(sheets[i].dur) / duration)
    }          
    SecondsArraySlides=SlidesToSeconds(sheets);
}    
  
  
  
function SlidesToSeconds(sheets) {
    var Seconds=[];
    for (var j=0;j < sheets.length;j++) {
         var subline=sheets[j];
         var s=parseInt(subline.start);
         var e=parseInt(parseFloat(subline.start)+parseFloat(subline.dur));  
        var nums = sheets[j].text.replace(/[^0-9]/g,'');
        var num = parseInt(nums);         
        for (var k=s; k< e;k++)
             Seconds[k]=num;
     }
     console.log("In SlidesToSeconds");
     console.log(Seconds);
     return Seconds;
}

export function UpdateSlide(CurrentPos) {   // called frequently
   var res=SecondsArraySlides[ parseInt(CurrentPos)]
   SetSlide(res);
}


async function SetSlide(n) {
    //console.log(`SetSlide ${n}`);
    if (n == prevslide) 
        return; // not changed
    prevslide=n;

    //preferredslide=n;
    if (slides[n])
        slideimage.src=slides[n];
    else
        slideimage.src="https://upload.wikimedia.org/wikipedia/commons/c/c0/Blank.gif"; // empty
} 
  
  
  
/* sheets

   if (setofsheets) { 
            if (slidenr < setofsheets.subtitle.length) {
                slideinfo = setofsheets.subtitle[slidenr];   
                if (parseFloat(slideinfo.start) >= (j> 0?parseFloat(subtitle[j-1].start):0) && (parseFloat(slideinfo.start) <= parseFloat(subtitle[j].start))) { // should be here
                    var spanslide=document.createElement("span");
                    
                    spanslide.innerHTML=`Slide: ${Math.round(parseFloat(slideinfo.start))} ${slideinfo.text} j=${j} ${Math.round(parseFloat(subtitle[j].start))} ${slides[num]}<br>`;
                    
                    
                    
                    languagespan.appendChild(spanslide);
                    slidenr++;
                }
                
            }
        }
    var slidenr=0;
    var slideinfo;
    if (setofsheets ) {// not allways present    
        console.log(setofsheets.lang_code );
        for (var i=0;i<setofsheets.subtitle.length;i++) {
            slideinfo = setofsheets.subtitle[i];
            console.log(`Start: ${Math.round(parseFloat(slideinfo.start))} ${slideinfo.text}<br>`);
        }
        
    }

**///


function PrepareSlideIndicators() {
    console.log("In PrepareSlideIndicators");
    var list = document.getElementsByClassName("slideposition");
    if (list && list[0]) {
        SlideIndicatorTemplate =  list[0];
        SlideIndicatorParent=list[0].parentNode
        list[0].remove();
    } else
        console.error("Slide indicator not found");
    
     PrepareSlideIndicators = function(){} // next time do nothing
    
}

export function ClearSlideIndicators() {
    
      
    promiseGetAllSlides= GetAllSlides();
    
    PrepareSlidesList(); // to prevent deleting the template & get PrepareSlidesListParent
    PrepareSlideIndicators()
    
    
    while (PrepareSlidesListParent.firstChild)
        PrepareSlidesListParent.removeChild(PrepareSlidesListParent.lastChild); // first remove previous children    
   

  while (SlideIndicatorParent.firstChild)
        SlideIndicatorParent.removeChild(SlideIndicatorParent.lastChild); // first remove previous children    
   
    
}    

function SetSlideIndicator(slidenr,xposperc,lengthperc) {
    console.log(`In SetSlideIndicator ${xposperc} ${lengthperc}`);
    var cln = SlideIndicatorTemplate.cloneNode(true);
    SlideIndicatorParent.appendChild(cln);
    cln.style.left= (xposperc*100)+"%";
    cln.style.width= (lengthperc*100)+"%";
    
    cln.title=`Slide: ${slidenr}`;
    
}    