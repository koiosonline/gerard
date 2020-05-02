//console.log(`In ${window.location.href} starting script: ${import.meta.url}`);

//import {GetYouTubePlaylists,GetYouTubePlayListItems}     from './koios_youtube.mjs';
import {LinkButton,HideButton,LinkClickButton,subscribe,LoadVideoSeen,CanvasProgressInfo,MonitorDomid,DomList,sleep,SelectTabBasedOnNumber,GetCourseInfo} from './koios_util.mjs';
import {player} from './koios_video.mjs';
import {getYtInfoIpfs} from './koios_ipfs.mjs';

// Global vars
var PrepareLessonsListTemplate;   
var PrepareLessonsListParent;  
var PrepareChapterTemplate;   
var PrepareChapterParent;  
export var CurrentLesson=0;
export var LastLesson=0;
export var CurrentCourseTitle="";
export var maxduration=0;

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
    console.log("In DisplayLessons")
    globalLoadVideoCB = LoadVideoCB;
    PrepButtons();
//    var x=await GetYouTubePlaylists()
//   var items=await GetYouTubePlayListItems()


var videoinfo=GetCourseInfo("videoinfo") || "QmUj3D5yMz5AMPBHVhFdUF2CpadeHDsEuyr1MSNjT5m31R"


/*
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let videoinfo = urlParams.get('videoinfo') || "QmUj3D5yMz5AMPBHVhFdUF2CpadeHDsEuyr1MSNjT5m31R"
//    "QmaamPoDLEhTa9fYC9c6ec7F4gng94zQsw3fWFGAyR8kMe" // "QmPZpwKA1fZWkeRofm8qEbu9AJYydBjD3BfobBtAv1SP4p"

*/


    console.log(videoinfo);
    var items=await getYtInfoIpfs(videoinfo)
    console.log(items)
    CurrentCourseTitle=items.title;
    maxduration=0;
    for (var i=0;i<items.videos.length;i++)      
         if (!items.videos[i].chapter)
             maxduration = Math.max(maxduration,items.videos[i].duration);
         
    console.log(`maxduration ${maxduration}`)     
         
    for (var i=0;i<items.videos.length;i++) {
        
        //console.log(items[i]);
        
       if (items.videos[i].chapter)
          AddChapter(items.videos[i].title)
       else {
          AddLessonsItem(items.videos[i]); //.title,items.videos[i].thumbnail,items.videos[i].description,items.videos[i].videoid,items.videos[i].duration);
          
          
       } 
    }    
    globalLessonslist = items;
    
    Webflow.require('slider').redraw(); // create to dots
    
    
    var prevlesson=localStorage.getItem(`lesson-${CurrentCourseTitle}`);
    
    console.log(`prevlesson ${prevlesson}`)
    
    return SelectLesson(prevlesson?prevlesson:0) // select a lesson with slides

    
        
             
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


function AddLessonsItem(vidinfo) { // txt,thumbnail,description,videoid,duration) {
    PrepareLessonsList();
    //console.log(`In AddLessonsItem ${txt} `);
    //var vidinfo={};
    //vidinfo.videoid=videoid;
    //vidinfo.duration=duration;
    //vidinfo.txt=txt;
    //vidinfo.description=description;
    
    
    vidinfo.txt=vidinfo.title; /// refactor
    
    onlyLessonsIndexList.push(vidinfo);    
    LastLesson=onlyLessonsIndexList.length-1; // allways keep this var updated.
    
    var index = LastLesson;
    var cln = PrepareLessonsListTemplate.cloneNode(true);
    PrepareLessonsListParent.appendChild(cln);
    //cln.getElementsByTagName("div")[0].innerHTML=vidinfo.txt;
    //cln.getElementsByTagName("img")[0].src=vidinfo.thumbnail;    
    

    cln.getElementsByClassName("lesson-name")[0].innerHTML=`${vidinfo.txt} (${vidinfo.duration} s)`;
    cln.getElementsByClassName("lesson-image")[0].src=vidinfo.thumbnail; 
    
    cln.id=`lesson-${index}`;
    
    cln.videoid=vidinfo.videoid; // to store & retrieve data about the video
    
    LinkButton(cln.id,x=> {
        console.log(`select lesson ${index}`);
        SelectLesson(index)
    });
    //GetProgressInfo(cln);
    
    var canvasloc=cln.getElementsByClassName("pi-lesson")[0]
    
    var seeninfothisvideo=LoadVideoSeen(vidinfo)
    CanvasProgressInfo(canvasloc,true,seeninfothisvideo,maxduration)  // vertical
    
    
     var target = GlobalVideoPagesList.AddListItem()
    // target.getElementsByTagName("h5")[0].innerHTML=`Video ${vidinfo.txt}`;
     if (target.getElementsByClassName("lesson-image-large").length > 0)
        target.getElementsByClassName("lesson-image-large")[0].src=vidinfo.thumbnail; 
    
    
    
    
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

    console.log(`In SelectLesson !! index=${index}`);
    if (index < 0)          index = 0;
    if (index > LastLesson) index = LastLesson;
   

   
    //HideButton("back",    index <= 0);
    //HideButton("forward", index >= LastLesson );

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
   
console.log(`Storing lesson nr lesson-${CurrentCourseTitle} ${CurrentLesson}`);
   localStorage.setItem(`lesson-${CurrentCourseTitle}`, CurrentLesson);
   
   
   
}


export async function SelectNextLesson(delta) {   
    SelectLesson(CurrentLesson + delta)
}


function PrepButtons() {
    //buttonBack=LinkButton("back"   ,x=>SelectLesson(CurrentLesson -1));
    
    //buttonBack=LinkClickButton("back");subscribe("backclick",x=>SelectLesson(CurrentLesson -1));
    
    
    //buttonForward=LinkButton("forward",x=>SelectLesson(CurrentLesson +1));
    
    //buttonForward=LinkClickButton("forward");subscribe("forwardclick",x=>SelectLesson(CurrentLesson +1));
    
    
    //subscribe("keypressedp",x=>SelectLesson(CurrentLesson -1)); 
    //subscribe("keypressedn",x=>SelectLesson(CurrentLesson +1)); 
    
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