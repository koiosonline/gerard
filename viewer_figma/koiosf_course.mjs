//console.log(`In ${window.location.href} starting script: ${import.meta.url}`);


import {loadScriptAsync,DomList,LinkToggleButton,subscribe,getElement,MonitorVisible,ForAllElements,setElementVal,publish,GetJson,LinkClickButton,LinkVisible} from '../lib/koiosf_util.mjs';
import {} from './koiosf_literature.mjs'// must be initialised to be able to follow up on setcurrentcourse
import {} from './koiosf_lessons.mjs'// must be initialised to be able to follow up on setcurrentcourse


class CourseList {    
    constructor (source) {
        this.CourseListPromise=GetJson(source)        
    }
 
    async GetList() {
        return await this.CourseListPromise;
    }
    
    GetMyList() {
        var mycourses=localStorage.getItem("mycourses")
        if (!mycourses) return [];
        return JSON.parse(mycourses)
    }
    
    async GetCourseData(ccid) {
        console.log("In GetCourseData");
        var listofcourses=await this.GetList(); 
        if (!ccid) return undefined;
        if (!listofcourses) return undefined;
        console.log(listofcourses)
        console.log(ccid)
        return listofcourses[ccid];
    }
    
    async GetCurrentCourseData() {
        return this.GetCourseData(this.GetCurrentCourse())
    }
    
    
    UpdateMyList(courseid,fremove) {
        console.log(`In UpdateMyList ${courseid} ${fremove}`);
        var cl=this.GetMyList();
        if (!cl) cl=[];
        if (fremove) {
            console.log(`fremove ${courseid}`)
            console.log(cl);
            var pos = cl.indexOf(courseid);
            console.log(pos)
            if (pos >=0 ) {
                cl.splice(pos,1);
            }
        } else {       
            if (cl.includes(courseid)) return; // check for duplicates
            cl.push(courseid); 
        }
        console.log(cl);
        localStorage.setItem("mycourses", JSON.stringify(cl))
        
        if (fremove || (cl.length==1)) { // if just 1 course present => select that one
            var current=this.GetCurrentCourse();
            if (current == courseid) {
                var first=cl[0];  //could be undefined
                this.SetCurrentCourse(first)
            }
        }
        if (!fremove && (cl.length==1)) { // if just 1 course present => select that one
            var first=cl[0];  //could be undefined
            this.SetCurrentCourse(first)
        }
        
    }
    
    SetCurrentCourse(courseid) {
        console.log(`SetCurrentCourse ${courseid}`) //courseid could be undefined
        var prevcourse=this.GetCurrentCourse()
        localStorage.setItem("courseid", courseid);  // this is how the player knows what is selected
        
        if (prevcourse != courseid)
            publish("unsetcurrentcourse",prevcourse) // broadcast to remove previouse course        
        
        publish("setcurrentcourse",courseid) // broadcast there is a new current course
    }

    GetCurrentCourse() {
        var cid=localStorage.getItem("courseid"); 
        console.log(cid);
        if (cid=="null") cid=undefined;
        if (cid=="undefined") cid=undefined;
        return cid;
    }
    LoadCurrentCourse() {
        var courseid=this.GetCurrentCourse()
        
        publish("setcurrentcourse",courseid) //courseid could be undefined
    }

}    

export var GlobalCourseList=new CourseList("https://gpersoon.com/koios/gerard/viewer_figma/courseinfo.json");

export async function GetCourseInfo(key) {
    var defaultreturn;
    switch (key) {
       case "slides": defaultreturn="QmWUXkvhWoaULAA1TEPv98VUYv8VqsiuuhqjHHBAmkNw2E";break;
       case "videoinfo": defaultreturn="QmUj3D5yMz5AMPBHVhFdUF2CpadeHDsEuyr1MSNjT5m31R";break;
    }
    
    var courseid=GlobalCourseList.GetCurrentCourse()
    
    console.log(`GetCourseInfo ${key} ${courseid}`)    
    var listofcourses=await GlobalCourseList.GetList();
    
    console.log("In GetCourseInfo");
    console.log(listofcourses)
    if (!courseid) return defaultreturn;
    if (!listofcourses) return defaultreturn;
    
    return listofcourses[courseid][key];
}



var globaldomlistcoursesother;
var globaldomlistcoursesmy;

async function asyncloaded() {    
    console.log(`In asyncloaded of script: ${import.meta.url}`); 
    LinkVisible("scr_other"  ,ScrOtherMadeVisible)    
    LinkVisible("scr_my"     ,ScrMyMadeVisible)        
    LinkVisible("scr_profile",ScrProfileMadeVisible)    
    LinkVisible("scr_viewer" ,ScrViewerMadeVisible)    
    LinkVisible("scr_detail" ,ScrDetailMadeVisible)    
    
    LinkClickButton("selectcourse",SelectCourse)     
    LinkClickButton("removecourse",RemoveCourse) 
    
    subscribe("setcurrentcourse",SetCurrentCourseOnScreen)
    subscribe("unsetcurrentcourse",UnSetCurrentCourseOnScreen)
    
    globaldomlistcoursesother = new DomList("courselistitem",getElement("scr_other"))
    globaldomlistcoursesmy = new DomList("courselistitem",getElement("scr_my"))
    console.log("globaldomlistcoursesmy");
    console.log(globaldomlistcoursesmy);
    
    
    GlobalCourseList.LoadCurrentCourse()
}    

async function ScrOtherMadeVisible() {
    console.log("In ScrOtherMadeVisible")
    var listofcourses=await GlobalCourseList.GetList();    
    globaldomlistcoursesother.EmptyList()
   var ml=GlobalCourseList.GetMyList();   
   for (const course in listofcourses) {    
        console.log(listofcourses[course]);
        if (ml.includes(course) ) continue; // skip my course        
        var c1 = globaldomlistcoursesother.AddListItem()        
        var data=listofcourses[course]        
        var mask=[["courselevel","__label"],["image","__icon"]]; 
            ForAllElements(data, mask, (id,val) => { setElementVal(id,val,c1) }) // find domid object with same name and copy value
        c1.id=course; // to be able to access it later
        c1.dataset.whattoselect="other"
    }
}    

async function ScrMyMadeVisible() {
    console.log("In ScrMyMadeVisible")
    var listofcourses=await GlobalCourseList.GetList();    
    var ml=GlobalCourseList.GetMyList();
    var current=GlobalCourseList.GetCurrentCourse()
    globaldomlistcoursesmy.EmptyList()    
    for (const course in listofcourses) {   
        if (!ml.includes(course) ) continue; // skip othercourses 
        console.log(listofcourses[course]);
        var c1 = globaldomlistcoursesmy.AddListItem()         
        var data=listofcourses[course]        
        var mask=[["courselevel","__label"],["image","__icon"]]; 
        ForAllElements(data, mask, (id,val) => { setElementVal(id,val,c1) }) // find domid object with same name and copy value
        
        c1.id=course; // to be able to access it later
        c1.dataset.whattoselect="my"
        
        
    }
    publish("setcurrentcourse",current)
}    



function UnSetCurrentCourseOnScreen(prevcourse) {
   console.log(`In UnSetCurrentCourseOnScreen ${prevcourse}`)
   var domid=getElement(prevcourse,"scr_my")    
   var domidclick=getElement("@click",domid)    
   domidclick.dispatchEvent(new CustomEvent("displaydefault")); 
}    

function SetCurrentCourseOnScreen(newcourse) {
    console.log(`In SetCurrentCourseOnScreen ${newcourse}`)
   var domid=getElement(newcourse,"scr_my")    
   var domidclick=getElement("@click",domid)    
   domidclick.dispatchEvent(new CustomEvent("displayactive")); 
}
    


async function ScrProfileMadeVisible() {
  console.log("In ScrProfileMadeVisible")  
  var data=(await GlobalCourseList.GetCurrentCourseData());
  var mask=[["courselevel","currentcoursename"],["image","courseicon"]]; 
  if (data)
    ForAllElements(data, mask, (id,val) => { setElementVal(id,val,getElement("scr_profile")) }) // find domid object with same name and copy value
}  

async function ScrViewerMadeVisible() {
    var strcurrentcourse=(await GlobalCourseList.GetCurrentCourseData()).courselevel;
     setElementVal("currentcoursename",strcurrentcourse,getElement("scr_viewer"))
     
     
   var data=(await GlobalCourseList.GetCurrentCourseData());
  var mask=[["courselevel","currentcoursename"],["image","courseicon"]]; 
  ForAllElements(data, mask, (id,val) => { setElementVal(id,val,getElement("scr_viewer")) }) // find domid object with same name and copy value
}    


function FindDomidWithId(event) {
    var detail=event;
    for (var i=0;i<10;i++) {
        if (!detail.detail) break
        else {
            detail=detail.detail; // check a couple of details
            console.log(detail);
        }
    }
        
    for (var i=0;i<10;i++) {
        if (detail.id) {
              console.log(`Found ${detail.id}`)
              console.log(detail);
             return detail;
        }
        else {
            detail=detail.parentNode; // check chain up to find id
            console.log(detail);
        }
    }
    return undefined;
}    


var originalbutton;

async function ScrDetailMadeVisible(event) {
    console.log("In ScrDetailMadeVisible")
    
    console.log(event)
 
    
    
    var target=FindDomidWithId(event);
    var courseid=target.id;
    var whattoselect=target.dataset.whattoselect;
    
    originalbutton=target;
    
    console.log(courseid);           
    if (courseid) {
        var data=await GlobalCourseList.GetCourseData(courseid) 
        console.log(data);
        var mask=["course","courselevel","level","contributer","level","subtitle","description","goal","start","duration","contributerdescription",["image","courseicon"]]; 
        ForAllElements(data, mask, (id,val) => { setElementVal(id,val,getElement("scr_detail")) }) // find domid object with same name and copy value
    }
   // getElement("scr_detail").dataset.whattoselect=whattoselect;
   // getElement("scr_detail").id=courseid;
}


function SelectCourse(event) {
    console.log("In SelectCourse");
    console.log(event);
    console.log("originalbutton");
    console.log(originalbutton);
    var courseid=originalbutton.id
    
    console.log(courseid);
    var whattoselect=originalbutton.dataset.whattoselect
    console.log(whattoselect);
    switch (whattoselect) {
        case "my":
            GlobalCourseList.SetCurrentCourse(courseid)        // also updates the screen
            break;
        case "other":
            GlobalCourseList.UpdateMyList(courseid)
             var domidclick=getElement("@click",originalbutton)    
            domidclick.dispatchEvent(new CustomEvent("hide"));  
            break;
    }
}    

function RemoveCourse(event) {


    
    console.log("In RemoveCourse");
    console.log(event);
    console.log("originalbutton");
    console.log(originalbutton);
    var courseid=originalbutton.id
    
    console.log(courseid);
    var whattoselect=originalbutton.dataset.whattoselect
    console.log(whattoselect);
    switch (whattoselect) {
        case "my":
            GlobalCourseList.UpdateMyList(courseid,true)            
            var domidclick=getElement("@click",originalbutton)    
            domidclick.dispatchEvent(new CustomEvent("hide"));  
            break;
        case "other":
            break;
    }

    
    
    
}   



window.addEventListener('DOMContentLoaded', asyncloaded);  // load  
 
  
