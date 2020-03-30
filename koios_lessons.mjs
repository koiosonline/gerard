console.log(`In ${window.location.href} starting script: ${import.meta.url}`);

import {GetYouTubePlaylists,GetYouTubePlayListItems}     from './koios_youtube.mjs';
import {LinkButton,HideButton} from './koios_util.mjs';

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

/*
class Task {
  constructor(name) {
    this.name = name;
  }
  GetName() {
    return this.name;
  }
}

class Video extends Task {
|

class Quiz extends Task {
}

class Chapter extends Task {
}


class Lesson {
    constructor() {
        this.length = 0;  
        this.data = {};
    }
}    
const lesson= new Lesson();



class Video {
   slides   => time
   transcripts [language] => time
   time[] => slide / transcript
}    
*/


var onlyLessonsIndexList=[]





export async function DisplayLessons(LoadVideoCB) {
    globalLoadVideoCB = LoadVideoCB;
    PrepButtons();
    var x=await GetYouTubePlaylists()
    var items=await GetYouTubePlayListItems()
    
    for (var i=0;i<items.length;i++) {
       if (items[i].chapter)
          AddChapter(items[i].title)
       else {
          AddLessonsItem(items[i].title,items[i].thumbnail,items[i].description,items[i].videoid,items[i].duration);
       } 
    }    
    globalLessonslist = items;
    return SelectLesson(1) // select a lesson with slides
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
    cln.getElementsByTagName("div")[0].innerHTML=txt;
    cln.getElementsByTagName("img")[0].src=thumbnail;    
    cln.id=`lesson-${index}`;
    
    LinkButton(cln.id,x=> {
        console.log(`select lesson ${index}`);
        SelectLesson(index)
    });
    
} 



function AddChapter(txt) {
    PrepareLessonsList();
    //console.log(`In AddChapter ${txt} `);    
    var cln = PrepareChapterTemplate.cloneNode(true);
    PrepareChapterParent.appendChild(cln);
    cln.getElementsByTagName("div")[0].innerHTML=txt;
} 

  

export async function SelectLesson(index) {   

    console.log(`In SelectLesson index=${index}`);
    if (index < 0)          index = 0;
    if (index > LastLesson) index = LastLesson;
    
    HideButton(buttonBack,    index <= 0);
    HideButton(buttonForward, index >= LastLesson );

    var prevdomid=document.getElementById(`lesson-${CurrentLesson}`);
    if (prevdomid) {        
       prevdomid.style.borderColor=""; // reset to original
    }
    var domid=document.getElementById(`lesson-${index}`);
    if (domid)
       domid.style.borderColor="red";
   CurrentLesson=index;   
  
   globalLoadVideoCB(onlyLessonsIndexList[CurrentLesson]);   
}


function PrepButtons() {
    buttonBack=LinkButton("back"   ,x=>SelectLesson(CurrentLesson -1));
    buttonForward=LinkButton("forward",x=>SelectLesson(CurrentLesson +1));
    PrepButtons=function(){} // next time do nothing
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


    