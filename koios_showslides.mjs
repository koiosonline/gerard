  //if (setofsheets) ******************************************************************
//       SetupSlideIndicators();


import {GetAllSlides,slides} from './koios_getslides.mjs';
import {publish} from './koios_util.mjs';




var slideimage;


var PrepareSlidesListTemplate;
var PrepareSlidesListParent;
var SlideIndicatorTemplate;
var SlideIndicatorParent;

var SecondsArraySlides;

var prevslide=0;



export function ShowTitles(fOn) {
    var videoinfo=document.getElementById("videoinfo");
    videoinfo.style.display=fOn?"flex":"none"
      
     var list = document.getElementsByClassName("slideinfo"); 
     for (var i=0;i<list.length;i++) {
         list[i].style.display=fOn?"block":"none"
         
    }    
}




function MouseOverSlides(ev) {
    
    console.log("In MouseOverSlides");
    switch (ev.type) {       
        case "mouseleave": ShowTitles(false);break; 
        case "mouseenter": ShowTitles(true);break;
    }
}
  
export async function SetupSlideWindow(windowid) {
    console.log("In SetupSlideWindow");
    var slidewindow=document.getElementById("move"); // connect to "move" circle
    
    slidewindow.addEventListener("mouseenter",   MouseOverSlides);    
    slidewindow.addEventListener("mouseleave",   MouseOverSlides); 
   // ShowTitles(false)
    
    
    
    
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
        //list[0].remove(); //keep original slide for situation where no slide is present; remove again
    } else
        console.error("real-slides not found");

    //for (var i=0;i<25;i++) {                                      // max 25 slides
        //var cln = PrepareSlidesListTemplate.cloneNode(true);
        //PrepareSlidesListParent.appendChild(cln);        
    //}
   //list[0].getElementsByTagName("h2")[0].innerHTML=`No slide`;
    
    PrepareSlidesList = function(){} // next time do nothing
}    


PrepareSlidesList(); // sooner


var slidenr=0;

export async function AddSlide(num,url,title) {
    //console.log(`Add slide ${url}  ${title}`);
    //PrepareSlidesList()
    
    var target = PrepareSlidesListTemplate.cloneNode(true);
    PrepareSlidesListParent.appendChild(target);  
    
    
//    var list = document.getElementsByClassName("real-slides")
//    var target=list[slidenr];
    if (target) {
        target.getElementsByTagName("img")[0].src=url;
        target.getElementsByTagName("h5")[0].innerHTML=title; // `Slide #${num} ${title}`;
        target.style.display="";
    }
    
    /*
    var domid=document.getElementById("slideplayer");
    //console.log(domid);

    
    dots[slidenr].style.display="";
    
*/    
   // console.log(dots);
    slidenr++;
}

function CleanSlides() {
  //  var list = document.getElementsByClassName("real-slides")
  //  var domid=document.getElementById("slideplayer");
    //var dots=domid.getElementsByClassName("w-slider-dot")
    
    //dots[0].id=`dot-${0}`;
    
//    for (var i=0;i<list.length;i++) { // start at 1, 0 again
    
//list[i].remove()    
    
    /*
        var target=list[i];
        target.getElementsByTagName("img")[0].src="";
        target.getElementsByTagName("h5")[0].innerHTML=`Empty slide #${i+1}`;
        target.style.display="none";
        dots[i].style.display="none";
        dots[i].id="";
    */
    
    //}
    slidenr=0;    // start at 1 => 0 again
    
    
    
    
        while (PrepareSlidesListParent.firstChild)
        PrepareSlidesListParent.removeChild(PrepareSlidesListParent.lastChild); // first remove previous children    
   
    
}    

var promiseGetAllSlides;


 


export async function FoundSlides(sheets,vidinfo) {           // found slide info via subtitles
    
    await promiseGetAllSlides; // wait till slide info from IPFS is ready
    console.log(`In FoundSlides`);
    console.log(sheets);
    //await slidepromise; // now we have the slides
    
    var duration = vidinfo.duration;
 
  //  CleanSlides(); don't clean, now 2 ways to trigger
  
  
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


export function PrepareAndLoadSlides(vidinfo) {
     CleanSlides(); 
     function FoundIndexJson(slideindex) {                                 // found slides via index.json on ipfs
        //console.log(`In FoundIndexJson title=${vidinfo.txt}`);        
        var getfirst=vidinfo.txt.split(" ")[0];
        var slidecount=0;        
        if (slideindex && slideindex.length > 0) 
            for (var i=0;i<slideindex.length;i++) 
                if (slideindex[i].chapter === getfirst) 
                    slidecount++;
        if (slidecount == 0) 
            AddSlide(0,"","No slides for this video");
        else {
            var slidenr=1;
            for (var i=0;i<slideindex.length;i++) 
                if (slideindex[i].chapter === getfirst) {
                    var title =`Slide ${slidenr++} of ${slidecount}: ${slideindex[i].chapter} ${slideindex[i].title}`;
                    AddSlide(slideindex[i].slidenr,slides[slideindex[i].slidenr],title);
                }
        }
       // ShowTitles(false); // initally hide the titles, via stop/play
        Webflow.require('slider').redraw(); // regenerate the dots    
        
        
         var domid=document.getElementById("slideplayer");
         var dots=domid.getElementsByClassName("w-slider-dot")
         for (var i=0;i<dots.length;i++)
            dots[i].id=`dot-${i+1}`;
        
        
        publish ("slidesloaded");       
    }    
      
    promiseGetAllSlides= GetAllSlides(FoundIndexJson);
    
    PrepareSlidesList(); // to prevent deleting the template & get PrepareSlidesListParent
    PrepareSlideIndicators()
    
    
//    while (PrepareSlidesListParent.firstChild)
//        PrepareSlidesListParent.removeChild(PrepareSlidesListParent.lastChild); // first remove previous children    
   

  while (SlideIndicatorParent.firstChild)
        SlideIndicatorParent.removeChild(SlideIndicatorParent.lastChild); // first remove previous children    
   
    
}  
  
  

export function UpdateSlide(CurrentPos) {   // called frequently
   if (SecondsArraySlides) {
      var res=SecondsArraySlides[ parseInt(CurrentPos)]
      SetSlide(res);
   } 
}


async function SetSlide(n) {
    
    if (!n) n=0; // show the first slide
    
  
    console.log(`SetSlide ${n}`);
    if (n == prevslide) 
        return; // not changed
    prevslide=n;
      
    var dot=document.getElementById(`dot-${n}`)
    if (dot)
        dot.click();   // select the right slide
    
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