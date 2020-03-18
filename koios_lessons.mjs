console.log(`In ${window.location.href} starting script: ${import.meta.url}`);

import {GetYouTubePlaylists,GetYouTubePlayListItems}     from './koios_youtube.mjs';
import {LinkButton,HideButton} from './koios_util.mjs';

// Global vars
var PrepareLessonsListTemplate;   
var PrepareLessonsListParent;  
var PrepareChapterTemplate;   
var PrepareChapterParent;  
var CurrentLesson=0;
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
    var x=await GetYouTubePlaylists()
    var items=await GetYouTubePlayListItems()
    
    for (var i=0;i<items.length;i++) {
       if (items[i].chapter)
          AddChapter(items[i].title)
       else {
          AddLessonsItem(items[i].title,items[i].thumbnail,items[i].description,items[i].videoid,items[i].duration,LoadVideoCB);
       } 
    }    
    globalLessonslist = items;
    return SelectLesson(3,LoadVideoCB) // select a lesson with slides
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


function AddLessonsItem(txt,thumbnail,description,videoid,duration,LoadVideoCB) {
    PrepareLessonsList();
    //console.log(`In AddLessonsItem ${txt} `);
    var vidinfo={};
    vidinfo.videoid=videoid;
    vidinfo.duration=duration;
    vidinfo.txt=txt;
    vidinfo.description=description;
    
    onlyLessonsIndexList.push(vidinfo);
    var index=onlyLessonsIndexList.length-1;
    
    var cln = PrepareLessonsListTemplate.cloneNode(true);
    PrepareLessonsListParent.appendChild(cln);
    cln.getElementsByTagName("div")[0].innerHTML=txt;
    cln.getElementsByTagName("img")[0].src=thumbnail;    
    cln.id=`lesson-${index}`;
    
    LinkButton(cln.id,x=> {
        console.log(`select lesson ${index}`);
        SelectLesson(index,LoadVideoCB,duration)
    });
    
} 



function AddChapter(txt) {
    PrepareLessonsList();
    //console.log(`In AddChapter ${txt} `);    
    var cln = PrepareChapterTemplate.cloneNode(true);
    PrepareChapterParent.appendChild(cln);
    cln.getElementsByTagName("div")[0].innerHTML=txt;
} 




 
var fPrepped=false;

async function SelectLesson(index,LoadVideoCB) {   
    function PrepButtons(buttonBack,buttonForward) {
        if (!fPrepped) {
            LinkButton(buttonBack   ,x=> SelectLesson(CurrentLesson-1,LoadVideoCB));
            LinkButton(buttonForward,x=> SelectLesson(CurrentLesson+1,LoadVideoCB));
            fPrepped=true;
        }
         HideButton(buttonBack,    CurrentLesson-1 < 0);
         HideButton(buttonForward, CurrentLesson+1 >= onlyLessonsIndexList.length );
    }    
    var prevdomid=document.getElementById(`lesson-${CurrentLesson}`);
    if (prevdomid) {        
       prevdomid.style.borderColor=""; // reset to original
    }
    var domid=document.getElementById(`lesson-${index}`);
    if (domid)
       domid.style.borderColor="red";
   CurrentLesson=index;   
   PrepButtons("back","forward");
   return LoadVideoCB(onlyLessonsIndexList[CurrentLesson]);   
}


function MoveLesson(fNext) { // false is previous, true is next
    startLesson += direction;
 
    if (startLesson < 0) return MoveLesson(0); // search first lesson
    if (startLesson >= globalLessonslist.length) startLesson=globalLessonslist.length;
 
    while (globalLessonslist[startLesson].chapter) {
        CurrentLesson += (direction==0?1:direction);
        if (startLesson < 0) return -1;
        if (startLesson >= globalLessonslist.length) return globalLessonslist.length;
    } 
    return startLesson; 
}


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


    