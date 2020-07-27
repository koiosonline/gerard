//console.log(`In ${window.location.href} starting script: ${import.meta.url}`);

import {LinkButton,HideButton,LinkClickButton,subscribe,LoadVideoSeen,MonitorDomid,DomList,sleep,SelectTabBasedOnNumber,GetJsonIPFS, getElement,FitOneLine,publish } from '../lib/koiosf_util.mjs';
import {player} from './koiosf_viewer.mjs';
import {GetCourseInfo,GlobalCourseList} from './koiosf_course.mjs';

export var CurrentLesson=0;
export var LastLesson=0;
export var CurrentCourseTitle="";
export var maxduration=0;

var buttonBack;
var buttonForward;


// format vidinfo
// title   
// chapter   (boolean)
// description  
// thumbnail
// videoid


subscribe("setcurrentcourse",NewCourseSelected)

class LessonList {    
    constructor (source) {
        console.log(`LessonList constructor ${source}`);
        this.chapters=[]
        this.lessons=[];
        this.LessonListPromise=GetJsonIPFS(source).then(items=>{ // so we can wait for it later            
            console.log(items)
            this.CurrentCourseTitle=items.title;
            for (var i=0;i<items.videos.length;i++) 
                if (items.videos[i].chapter)
                    this.chapters.push(items.videos[i]);
                else
                    this.lessons.push(items.videos[i]);
            console.log(this.chapters)
            console.log(this.lessons);                    
        })
        console.log(this.LessonListPromise);
    }
        
    async GetLessonsList() {
        await this.LessonListPromise;
        return this.lessons;        
    }
    
    async GetChaptersList() {
        await this.LessonListPromise;
        return this.chapters;        
    }
    
    async GetLessonData() {
        await ProcessList();
        return 
        
    }
    
    async GetCurrentLessonData() {
        
    }
    
    
    UpdateMyList(courseid,fremove) {
        
    }
    
    async SetCurrentLesson(lessonid) {
         var currentcourse=GlobalCourseList.GetCurrentCourse()
         console.log(`Storing lesson nr lesson-${currentcourse} ${lessonid}`);
         if (lessonid <0) lessonid=0
         if (lessonid >= this.lessons.length) index = this.lessons.length-1;
         
         localStorage.setItem(`lesson-${currentcourse}`, lessonid);  
         
         var lessons=await this.GetLessonsList()
         publish("loadvideo",lessons[lessonid])
         return lessonid;
    }

    GetCurrentLesson() {
        var currentcourse=GlobalCourseList.GetCurrentCourse()
        var currentlesson=localStorage.getItem(`lesson-${currentcourse}`); // could be undefined        
        if (!currentlesson) currentlesson=0; // start at first lesson
        return currentlesson;
    }
    
    LoadCurrentLesson() {
        
    }

}    



    

var PrepareLessonsList;
var PrepareChapterList;

export var GlobalLessonList;

async function NewCourseSelected() {   
    console.log("In NewCourseSelected");
    PrepareLessonsList.EmptyList()
    PrepareChapterList.EmptyList()    
    var videocid=await GetCourseInfo("videoinfo") 
    console.log("videocid");
    console.log(videocid);        
    GlobalLessonList=new LessonList(videocid)    
    var lessons=await GlobalLessonList.GetLessonsList()
    for (var i=0;i<lessons.length;i++)
           AddLessonsItem(lessons[i],i)    
    var chapters=await GlobalLessonList.GetChaptersList()   
    if (chapters)    
        for (var i=0;i<chapters.length;i++)
            AddChapter(chapters[i])     
    SelectLesson(await GlobalLessonList.GetCurrentLesson())    
}

function AddChapter(vidinfo) {    
    var txt=vidinfo.title;    
    console.log(`AddChapter ${txt}`)
    var cln=PrepareChapterList.AddListItem()
    cln.getElementsByClassName("chapter-name")[0].innerHTML=txt;
} 





function AddLessonsItem(vidinfo,index) { // txt,thumbnail,description,videoid,duration) {
    console.log(`AddLessonsItem ${vidinfo.title}`);
    vidinfo.txt=vidinfo.title; /// refactor
    var cln = PrepareLessonsList.AddListItem() //Template.cloneNode(true);
    getElement("lesson-name",cln).innerHTML=vidinfo.txt;    
    FitOneLine(getElement("lesson-name",cln))    
    var date = new Date(null);
    date.setSeconds(vidinfo.duration); // specify value for SECONDS here
    var result = date.toISOString().substr(10, 9);
    result=result.replace("T00:", "T");
    result=result.replace("T", "");
    getElement("videolength",cln).innerHTML=result        
    cln.id=`lesson-${index}`;    
    cln.videoid=vidinfo.videoid; // to store & retrieve data about the video       
    SetClickPlay(getElement("playbuttonfromlist",cln),index)    
    var seeninfothisvideo=LoadVideoSeen(vidinfo)        
    console.log("AddLessonsItem");
    console.log(vidinfo.txt);
    console.log(seeninfothisvideo);
    var disp=seeninfothisvideo.seenend?"displayactive":"displaydefault"
    console.log(disp);
    getElement("seenvideo",cln).dispatchEvent(new CustomEvent(disp))    
    console.log(getElement("seenvideo",cln))
} 

function SetClickPlay(domid,index) { // seperate function to remember state
    console.log(`SetClickPlay ${index}`);
    console.log(domid);
    
    domid.addEventListener('click', e=> {
        console.log("Click event in SetClickPlay");
        console.log(e);    
        console.log(index);       
          
        SelectLesson(index)
        }
     );
}   
  


export async function SelectLesson(index) {   
    console.log(`In SelectLesson !! index=${index}`);
    
    var oldindex=await GlobalLessonList.GetCurrentLesson(index)
    var newindex=await GlobalLessonList.SetCurrentLesson(index)
    
    
    
    var prevdomid=getElement(`lesson-${oldindex}`);
    if (prevdomid) {        
       prevdomid.style.borderColor=""; // reset to original
       prevdomid.style.borderStyle="";
    }
    var domid=getElement(`lesson-${newindex}`);
    if (domid)
       domid.style.borderColor="red";
       domid.style.borderStyle="solid";
    
    
    
    
}


export async function SelectNextLesson(delta) {   
    SelectLesson(parseInt(CurrentLesson) + parseInt(delta))
}

 
//async function asyncloadedles() { 
    console.log("In asyncloaded PrepareLessonsList");
    PrepareLessonsList = new DomList("list-lessons")
    if (!PrepareLessonsList)
        console.error("list-lessons not found");
    PrepareChapterList = new DomList("list-chapter")
    if (!PrepareChapterList)
        console.error("list-chapter not found");   
    
//}    




//window.addEventListener('DOMContentLoaded', asyncloadedles);  // load  

