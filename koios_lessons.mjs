//console.log(`In ${window.location.href} starting script: ${import.meta.url}`);

import {GetYouTubePlaylists,GetYouTubePlayListItems}     from './koios_youtube.mjs';
import {LinkButton,HideButton,LinkClickButton,subscribe,LoadVideoSeen,CanvasProgressInfo,MonitorDomid,DomList,sleep,SelectTabBasedOnNumber} from './koios_util.mjs';
import {player} from './koios_video.mjs';

// Global vars
var PrepareLessonsListTemplate;   
var PrepareLessonsListParent;  
var PrepareChapterTemplate;   
var PrepareChapterParent;  
export var CurrentLesson=0;
export var LastLesson=0;


var buttonBack;
var buttonForward;

var globalLoadVideoCB;
var globalLessonslist; // format:
// title   
// chapter   (boolean)
// description  
// thumbnail
// videoid




var onlyLessonsIndexList=[]





export async function DisplayLessons(LoadVideoCB) {
    globalLoadVideoCB = LoadVideoCB;
    PrepButtons();
    var x=await GetYouTubePlaylists()
    var items=await GetYouTubePlayListItems()
    
    for (var i=0;i<items.length;i++) {
        
        
        //console.log(items[i]);
        
       if (items[i].chapter)
          AddChapter(items[i].title)
       else {
          AddLessonsItem(items[i].title,items[i].thumbnail,items[i].description,items[i].videoid,items[i].duration);
       } 
    }    
    globalLessonslist = items;
    
    Webflow.require('slider').redraw(); // create to dots
    
    return SelectLesson(0) // select a lesson with slides
}



function PrepareLessonsList() {
    console.log("In PrepareLessonsList");
    var list = document.getElementsByClassName("list-lessons");
    //console.log(list)    
    if (list && list[0]) {
        PrepareLessonsListTemplate = list[0];        
        PrepareLessonsListParent   = list[0].parentNode
        list[0].remove();
    } else
        console.error("list-lessons not found");
    
    list = document.getElementsByClassName("list-chapter");
    //console.log(list)
    if (list && list[0]) {
        PrepareChapterTemplate = list[0];
        PrepareChapterParent   = list[0].parentNode
        list[0].remove();
    } else
        console.error("list-chapter not found");
        
    PrepareLessonsList = function(){} // next time do nothing
}    


function AddLessonsItem(txt,thumbnail,description,videoid,duration) {
    PrepareLessonsList();
    //console.log(`In AddLessonsItem ${txt} `);
    var vidinfo={};
    vidinfo.videoid=videoid;
    vidinfo.duration=duration;
    vidinfo.txt=txt;
    vidinfo.description=description;
    
    onlyLessonsIndexList.push(vidinfo);    
    LastLesson=onlyLessonsIndexList.length-1; // allways keep this var updated.
    
    var index = LastLesson;
    var cln = PrepareLessonsListTemplate.cloneNode(true);
    PrepareLessonsListParent.appendChild(cln);
    //cln.getElementsByTagName("div")[0].innerHTML=txt;
    //cln.getElementsByTagName("img")[0].src=thumbnail;    
    

    cln.getElementsByClassName("lesson-name")[0].innerHTML=txt;
    cln.getElementsByClassName("lesson-image")[0].src=thumbnail; 
    
    cln.id=`lesson-${index}`;
    
    cln.videoid=videoid; // to store & retrieve data about the video
    
    LinkButton(cln.id,x=> {
        console.log(`select lesson ${index}`);
        SelectLesson(index)
    });
    //GetProgressInfo(cln);
    
    var canvasloc=cln.getElementsByClassName("pi-lesson")[0]
    
    var seeninfothisvideo=LoadVideoSeen(vidinfo)
    CanvasProgressInfo(canvasloc,false,seeninfothisvideo)  // vertical
    
    
     var target = GlobalVideoPagesList.AddListItem()
    // target.getElementsByTagName("h5")[0].innerHTML=`Video ${txt}`;
     if (target.getElementsByClassName("lesson-image-large").length > 0)
        target.getElementsByClassName("lesson-image-large")[0].src=thumbnail; 
    
    
    
    
} 




function AddChapter(txt) {
    PrepareLessonsList();
    //console.log(`In AddChapter ${txt} `);    
    var cln = PrepareChapterTemplate.cloneNode(true);
    PrepareChapterParent.appendChild(cln);
    //cln.getElementsByTagName("div")[0].innerHTML=txt;
    
    cln.getElementsByClassName("chapter-name")[0].innerHTML=txt;
} 

  

export async function SelectLesson(index) {   

    console.log(`In SelectLesson index=${index}`);
    if (index < 0)          index = 0;
    if (index > LastLesson) index = LastLesson;
    
    HideButton("back",    index <= 0);
    HideButton("forward", index >= LastLesson );

    var prevdomid=document.getElementById(`lesson-${CurrentLesson}`);
    if (prevdomid) {        
       prevdomid.style.borderColor=""; // reset to original
    }
    var domid=document.getElementById(`lesson-${index}`);
    if (domid)
       domid.style.borderColor="red";
   CurrentLesson=index;   
  
   globalLoadVideoCB(onlyLessonsIndexList[CurrentLesson]);   
   SelectTabBasedOnNumber("videofield",CurrentLesson);
   
}


function PrepButtons() {
    //buttonBack=LinkButton("back"   ,x=>SelectLesson(CurrentLesson -1));
    
    buttonBack=LinkClickButton("back");subscribe("backclick",x=>SelectLesson(CurrentLesson -1));
    
    
    //buttonForward=LinkButton("forward",x=>SelectLesson(CurrentLesson +1));
    
    buttonForward=LinkClickButton("forward");subscribe("forwardclick",x=>SelectLesson(CurrentLesson +1));
    
    
    subscribe("keypressedp",x=>SelectLesson(CurrentLesson -1)); 
    subscribe("keypressedn",x=>SelectLesson(CurrentLesson +1)); 
    
    PrepButtons=function(){} // next time do nothing
}
 
 

var GlobalVideoPagesList;



subscribe("playerloading",  InitLessons);

function InitLessons() {
    
    GlobalVideoPagesList = new DomList("real-videos")
    
    MonitorDomid("videofield","w-slider-nav","w-slider-dot","w-active",VideoChildChanged)       
}



 
/* 


export async function GetLessonInfo(lessonspromise,direction=0) { // -1 is previous, 0 is current, +1 is next
    var res;
    await lessonspromise; // zeker weten dat de lessen geladen zijn
    CurrentLesson += direction;
    CurrentLesson = (CurrentLesson < 0? 0  : ( CurrentLesson >= globalLessonslist.length?globalLessonslist.length-1:CurrentLesson));    
    res=globalLessonslist[CurrentLesson];
    
    while (res.chapter && CurrentLesson < globalLessonslist.length) {
        CurrentLesson += (direction==0?1:direction)
        CurrentLesson = (CurrentLesson < 0? 0  : ( CurrentLesson >= globalLessonslist.length?globalLessonslist.length-1:CurrentLesson));
        res=globalLessonslist[CurrentLesson];
    }
    
    console.log(`Found id: ${res.videoid}`);
    console.log(CurrentLesson);
    return res.videoid;
}
*/







function VideoChildChanged(childdomid,childnr) {
    console.log(`In function VideoChildChanged ${childnr}`);
    
    //var videoplayercontainer=document.getElementById("videoplayercontainer");
    /*
    console.log(childnr);
    
    var rv=document.getElementsByClassName("real-videos");
    console.log(rv);
    if (videoplayercontainer && rv.length > 0 && rv[childnr])
        rv[childnr].appendChild(videoplayercontainer);
    console.log(onlyLessonsIndexList);
    */
    
      //  player.cueVideoById(onlyLessonsIndexList[childnr].videoid,0)
    if (onlyLessonsIndexList.length > 0 && childnr !=CurrentLesson) // not neccesary when already on CurrentLesson
        SelectLesson(childnr)
    
    
        
}    

subscribe("loadvideo",ShowThumbnails);
//subscribe("videocued",  ShowPlayButton);
subscribe("videostarted",HideThumbnail)


async function ShowThumbnails() {
   var vimages=document.getElementsByClassName("lesson-image-large")
    for (var i=0;i<vimages.length;i++)
        vimages[i].style.display="block";
}    

async function HideThumbnail() {    
    var vimages=document.getElementsByClassName("lesson-image-large")
    vimages[CurrentLesson].style.display="none";
}    

/*
var videoplayercontainer=document.getElementById("videoplayercontainer");
videoplayercontainer.style.display="none"
await sleep(300);
videoplayercontainer.style.display="block"

*/