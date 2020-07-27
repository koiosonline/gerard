import {loadScriptAsync,GetJsonIPFS,subscribe,publish,DomList,GetCidViaIpfsProvider,getElement,sortfunction } from '../lib/koiosf_util.mjs';
import {GetCourseInfo,GlobalCourseList} from './koiosf_course.mjs';
import {GlobalLessonList} from './koiosf_lessons.mjs';

var globalslideindex

async function NewCourseSelected (courseid) {
    console.log(`In NewCourseSelected ${courseid}`);
    let cid =  await GetCourseInfo("slides") 
    console.log(`In NewCourseSelected cid=${cid}`);
    globalslideindex = await GetJsonIPFS(cid);        
    globalslideindex.sort(sortfunction);
    await GetLiteratureForVideo()
}    
   

window.addEventListener('DOMContentLoaded', asyncloaded);  // load  

subscribe("setcurrentcourse",NewCourseSelected)
    
async function asyncloaded() {  
    //publish("playerloading"); // to init notes done twice
   
    var domid=getElement("browse-window");
    var iframe=document.createElement("iframe");
    iframe.width="100%"
    iframe.height="100%"
    iframe.name="browse-window-frame"
    domid.appendChild(iframe);
    console.log("Prepare for setcurrentcourse");
    GlobalUrlList = new DomList("browser-url") // before real-slides (because is child)  
}


subscribe("loadvideo",GetLiteratureForVideo);


var GlobalUrlList 

async function GetLiteratureForVideo() {   
    var lesson=await GlobalLessonList.GetCurrentLesson()
    var lessons=await GlobalLessonList.GetLessonsList()
    var vidinfo=lessons[lesson]
    console.log(lesson)
    console.log(lessons)
    
    console.log(vidinfo);
        
    if (!vidinfo) return;
    
    var match=(vidinfo.title).split(" ")[0]
    console.log(`In GetLiteratureForVideo match=${match}`);
    GlobalUrlList.EmptyList()    
    
    if (!globalslideindex) return; // not loaded yet
    var slideindex=globalslideindex

    var str="";
       for (var i=0;i<slideindex.length;i++) {
        if (match && slideindex[i].chapter !== match) 
            continue; // ignore
            
        var url = slideindex[i].url
        if (!url && slideindex[i].cid) {
            url = slideindex[i].cid
            url = GetCidViaIpfsProvider(slideindex[i].cid,0)
            url = `https://docs.google.com/viewerng/viewer?url=${url}&embedded=true`;
        }
        if (!url && slideindex[i].pdf) {                
            url = slideindex[i].pdf
            url = `https://docs.google.com/viewerng/viewer?url=${url}&embedded=true`;
        }    
        if (url) {            
            str +=SetInfo(url,slideindex[i].title,"browse-window-frame",slideindex[i].url?false:true)+"<br>"
        }
    }          
    
 //   SetExtLink(str)  don't show the entire external tab
}
    

var prevurl=undefined

    function SetInfo(url,txt,target,fDocument) { 
        if (url == prevurl) return "";  // filter out duplicates (already sorted)
        prevurl = url;
    
        url = url.replace("http:","https:"); // to prevent error messages from browser
        var urltarget = GlobalUrlList.AddListItem()  
        
//console.log(`In SetInfo ${url} ${txt}`)
//console.log(urltarget);
        var link_ext=urltarget.getElementsByClassName("link_ext")[0]
        var link_int=urltarget.getElementsByClassName("link_int")[0]
        
        if (!txt)
            txt=url
        
        var todisplay=txt // `${fDocument?"Doc":"url"}: ${txt}`
        link_int.innerHTML=todisplay
        link_int.href=url
        link_int.target=target
        
        link_int.title = txt; // hoover text to see entire link
        //urltarget.style.overflow="hidden"
        //urltarget.style.textOverflow="ellipsis"  
        link_int.style.overflow="hidden"
        link_int.style.textOverflow="ellipsis"  
        link_int.style.whiteSpace="nowrap"
  
        link_ext.href=url
        link_ext.target="_blank"
        link_ext.title=`External tab: ${txt}`
        
        var str=`<a href="${url}">${txt}</a>`
        return str;
    }    


    function SetExtLink(html) {
        var blob = new Blob([html], {type: 'text/html'});
        var url = URL.createObjectURL(blob);      
        SetInfo(url,"external","_blank",false);    
    }    


