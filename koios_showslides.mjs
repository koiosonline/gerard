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
    //var slidewindow=document.getElementById(windowid);
    //slideimage=document.createElement("img");
    
    //slideimage.style.width = "100%";
    //slideimage.style.height = "100%"; 
    //slidewindow.appendChild(slideimage);
    //SetSlide(undefined);
}



function PrepareSlidesList() {
    console.log("In PrepareSlidesList");
    var list = document.getElementsByClassName("real-slides"); // list-slides
    //console.log(list)    
    if (list && list[0]) {
        PrepareSlidesListTemplate = list[0];        
        PrepareSlidesListParent   = list[0].parentNode
        list[0].remove(); //keep original slide for situation where no slide is present; remove again
    } else
        console.error("real-slides not found");

    for (var i=0;i<10;i++) {
        var cln = PrepareSlidesListTemplate.cloneNode(true);
        PrepareSlidesListParent.appendChild(cln);
        
    }
   //list[0].getElementsByTagName("h2")[0].innerHTML=`No slide`;
    
    PrepareSlidesList = function(){} // next time do nothing
}    


PrepareSlidesList(); // sooner


var slidenr=0;

export async function AddSlide(num,url,title) {
    //console.log(`Add slide ${url}  ${title}`);
    //PrepareSlidesList()
    var list = document.getElementsByClassName("real-slides")
    var target=list[slidenr];
    if (target) {
        target.getElementsByTagName("img")[0].src=url;
        target.getElementsByTagName("h5")[0].innerHTML=`Slide #${num} ${title}`;
        target.style.display="";
    }
    
    var domid=document.getElementById("slideplayer");
    //console.log(domid);
    var dots=domid.getElementsByClassName("w-slider-dot")
    dots[slidenr].id=`dot-${num}`;
    
    dots[slidenr].style.display="";
    
    
   // console.log(dots);
    slidenr++;
}

function CleanSlides() {
    var list = document.getElementsByClassName("real-slides")
    var domid=document.getElementById("slideplayer");
    var dots=domid.getElementsByClassName("w-slider-dot")
    
    dots[0].id=`dot-${0}`;
    
    for (var i=0;i<list.length;i++) { // start at 1, 0 again
        var target=list[i];
        target.getElementsByTagName("img")[0].src="";
        target.getElementsByTagName("h5")[0].innerHTML=`Empty slide #${i+1}`;
        target.style.display="none";
        dots[i].style.display="none";
        dots[i].id="";
    }
    slidenr=0;    // start at 1 => 0 again
}    

var promiseGetAllSlides;


 


export async function FoundSlides(sheets,vidinfo) {
    
    await promiseGetAllSlides; // wait till slide info from IPFS is ready
    console.log(`In FoundSlides`);
   // console.log(sheets);
    //await slidepromise; // now we have the slides
    
    var duration = vidinfo.duration;
 
  //  CleanSlides(); don't clean, now 2 ways to trigger
    if (sheets) {
        for (var i=0;i<sheets.length;i++) {
            var nums = sheets[i].text.replace(/[^0-9]/g,'');
            var num = parseInt(nums);
            AddSlide(num,slides[num],"");
            SetSlideIndicator(num,parseFloat(sheets[i].start) / duration,parseFloat(sheets[i].dur) / duration)
        }          
        SecondsArraySlides=SlidesToSeconds(sheets);
    }
}    



export function PrepareAndLoadSlides(vidinfo) {
     CleanSlides(); 
     function FoundIndexJson(slideindex) {
        //console.log(`In FoundIndexJson title=${vidinfo.txt}`);
        
        var getfirst=vidinfo.txt.split(" ")[0];
        //console.log(getfirst);
        
        if (getfirst.includes("-"))
            getfirst=getfirst.split("-")[1];
         // console.log(getfirst);
        
        if (slideindex && slideindex.length > 0) {
            for (var i=0;i<slideindex.length;i++) {
                //console.log(`Compare ${slideindex[i].chapter} ${getfirst}`);
                if (slideindex[i].chapter == getfirst) {
                    //console.log(slideindex[i].slidenr);
                    AddSlide(slideindex[i].slidenr,slides[slideindex[i].slidenr],`${slideindex[i].chapter} ${slideindex[i].title}`);
                }
            }
        } else console.log("No slides for this video");
    }    
      
    promiseGetAllSlides= GetAllSlides(FoundIndexJson);
    
    PrepareSlidesList(); // to prevent deleting the template & get PrepareSlidesListParent
    PrepareSlideIndicators()
    
    
//    while (PrepareSlidesListParent.firstChild)
//        PrepareSlidesListParent.removeChild(PrepareSlidesListParent.lastChild); // first remove previous children    
   

  while (SlideIndicatorParent.firstChild)
        SlideIndicatorParent.removeChild(SlideIndicatorParent.lastChild); // first remove previous children    
   
    
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
     //console.log("In SlidesToSeconds");
     //console.log(Seconds);
     return Seconds;
}

export function UpdateSlide(CurrentPos) {   // called frequently
   if (SecondsArraySlides) {
      var res=SecondsArraySlides[ parseInt(CurrentPos)]
      SetSlide(res);
   } 
}


async function SetSlide(n) {
    
    if (!n) n=0; // show the first slide
    
  
    //console.log(`SetSlide ${n}`);
    if (n == prevslide) 
        return; // not changed
    prevslide=n;
      
    document.getElementById(`dot-${n}`).click();   // select the right slide
    
    /*
    //preferredslide=n;
    if (slides[n])
        slideimage.src=slides[n];
    else
        slideimage.src="https://upload.wikimedia.org/wikipedia/commons/c/c0/Blank.gif"; // empty
*/
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
 //       list[0].remove();
    } else
        console.error("Slide indicator not found");
    
     PrepareSlideIndicators = function(){} // next time do nothing
    
}
  

function SetSlideIndicator(slidenr,xposperc,lengthperc) {
  //  console.log(`In SetSlideIndicator ${xposperc} ${lengthperc}`);
    var cln = SlideIndicatorTemplate.cloneNode(true);
    SlideIndicatorParent.appendChild(cln);
    
     
    cln.style.left= (xposperc*100)+"%";
    cln.style.width= (lengthperc*100)+"%";
    
    cln.title=`Slide: ${slidenr}`;
    
}    