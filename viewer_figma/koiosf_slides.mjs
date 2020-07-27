import {publish,subscribe,GetCidViaIpfsProvider,DomList,sleep,MonitorDomid,getElement,loadScriptAsync,GetJsonIPFS,GetImageIPFS} from '../lib/koiosf_util.mjs';
import {GetCourseInfo} from './koiosf_course.mjs';

var SecondsArraySlides;
var prevslide=undefined;
var GlobalPrepareSlidesList; 
//var GlobalSlideIndicatorList;
var GlobalUrlList;



subscribe("playerloading",  InitShowSlides);
subscribe("loadvideo",GetSlidesFromVideo) // a new video has been loaded/selected
//subscribe("foundslides",FoundSlidesViaJson) // called when sheets are found via json file



class SlideList {    
    constructor () {        
    }
    async GetList() {
        return await this.SlideListPromise;
    }
    async SwitchList(cid) {
        this.currentSlide=0;
        if (this.cid == cid) return this.SlideListPromise// hasn't been changed
        this.cid = cid;
        this.SlideListPromise=GetJsonIPFS(cid)
        return this.SlideListPromise;
    }    

    GetCurrentSlide() {
        console.log("GetCurrentSlide");
        console.log(this.currentList);
        console.log(this.currentSlide);
        return this.currentList[this.currentSlide];
    }
     
    async LoadList(match) {
        if (this.currentList) {
            for (var i=0;i<this.currentList.length;i++)
               URL.revokeObjectURL(this.currentList[i])   
        }    
        
        this.currentList=[]        
        this.match=match;
        var list = await this.GetList()    
        if (list)        
            for (var i=0;i<list.length;i++) {
                if ( ! ((list[i].chapter === this.match) && (list[i].png) )) continue; // skip this one
                var slidesinfo = list[i]
                if (!slidesinfo.png) continue;        
                var url= await GetImageIPFS(slidesinfo.png)
                this.currentList.push(url)            
            }
        console.log(this.currentList);
        return this.currentList;
    }
    
    MoveSlide(fForward) {
        console.log(`In MoveSlide ${fForward}`)
        console.log(this.currentSlide);
        console.log(this.currentList);
        console.log(this.currentList.length)
        if (fForward) { this.currentSlide++;if (this.currentSlide >=this.currentList.length) this.currentSlide =this.currentList.length-1;}
        else          { this.currentSlide--;if (this.currentSlide <0) this.currentSlide =0;}
        
    }
   
    
}    
    

 

var GlobalSlideList


async function InitShowSlides() {
    console.log("In InitShowSlides");      
    getElement("slideleft").addEventListener('animatedclick',SlideLeft)  
    getElement("slideright").addEventListener('animatedclick',SlideRight)      
    GlobalSlideList = new SlideList();
}

async function GetSlidesFromVideo(vidinfo) {    
    
    console.log("In GetSlidesFromVideo");
    console.log(vidinfo);    
    if (!vidinfo) return
    var match = vidinfo.txt.split(" ")[0];    
    var cid= await GetCourseInfo("slides")
    var slideindex = await GlobalSlideList.SwitchList(cid)   
    var currentlist = await GlobalSlideList.LoadList(match)   
    publish ("slidesloaded");
    ShowSlide();
}    
   
   

export function UpdateSlide(CurrentPos) {   // called frequently
   if (SecondsArraySlides) {
      var res=SecondsArraySlides[ parseInt(CurrentPos)]
      //SetSlide(res);
   } 
}

 


 

async function ShowSlide() {    
    var url=GlobalSlideList.GetCurrentSlide()
    var slide=getElement("slideimage")
    slide.src=url;
    slide.style.width="100%"
    slide.style.height="";
    slide.style.left="0px"
    slide.style.top="0px"
    
    

} 




function SlideLeft() {
    console.log(GlobalSlideList);
    GlobalSlideList.MoveSlide(false);
    ShowSlide()
}

function SlideRight() {
    console.log(GlobalSlideList);
    GlobalSlideList.MoveSlide(true);
    ShowSlide()
}    
    


