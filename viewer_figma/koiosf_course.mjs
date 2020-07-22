//console.log(`In ${window.location.href} starting script: ${import.meta.url}`);


import {loadScriptAsync,DomList,LinkToggleButton,subscribe,getElement,MonitorVisible,ForAllElements,setElementVal,publish,GetJson} from '../lib/koiosf_util.mjs';



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
    
    async GetCurrentCourseData() {
        console.log("In GetCurrentCourseData");
        var listofcourses=await this.GetList(); 
        var ccid=this.GetCurrentCourse();
        console.log(listofcourses)
        console.log(ccid)
        return listofcourses[ccid];
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
    }
    

    SetCurrentCourse(courseid) {
        console.log(`SetCurrentCourse ${courseid}`)
        localStorage.setItem("courseid", courseid);  // this is how the player knows what is selected
        
        publish("setcurrentcourse",courseid) // broadcast there is a new current course
    }

    GetCurrentCourse() {
        return localStorage.getItem("courseid"); 
    }

}    

var GlobalCourseList=new CourseList("https://gpersoon.com/koios/gerard/viewer_figma/courseinfo.json");

export async function GetCourseInfo(key) {
    var courseid=GlobalCourseList.GetCurrentCourse()
    
    console.log(`GetCourseInfo ${key} ${courseid}`)    
    var listofcourses=await GlobalCourseList.GetList();
    
    console.log("In GetCourseInfo");
    console.log(listofcourses)
    if (!courseid) return undefined;
    
    return listofcourses[courseid][key];
}



var globaldomlistcoursesother;
var globaldomlistcoursesmy;

async function asyncloaded() {    
    console.log(`In asyncloaded of script: ${import.meta.url}`); 
    getElement("scr_other").addEventListener('madevisible',ScrOtherMadeVisible)    
    getElement("scr_my").addEventListener('madevisible',ScrMyMadeVisible)        
    getElement("scr_profile").addEventListener('madevisible',ScrProfileMadeVisible)    
    getElement("scr_viewer").addEventListener('madevisible',ScrViewerMadeVisible)    
    
    
    globaldomlistcoursesother = new DomList("courselistitem",getElement("scr_other"))
    globaldomlistcoursesmy = new DomList("courselistitem",getElement("scr_my"))
    console.log("globaldomlistcoursesmy");
    console.log(globaldomlistcoursesmy);
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
        //getElement("__label",c1).innerHTML=listofcourses[course].courselevel
        
        var data=listofcourses[course]
        
          var mask=[["courselevel","__label"],["image","__icon"]]; 
            ForAllElements(data, mask, (id,val) => { setElementVal(id,val,c1) }) // find domid object with same name and copy value
        
        var button=getElement("@click",c1)
        
        SetClick(button,course,listofcourses[course]);
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
        var button=getElement("@click",c1)
        
        
         if (course == current) {
            console.log(`In ScrMyMadeVisible ${current}`)            
            var ev = new CustomEvent("displayactive");
            button.dispatchEvent(ev); 
        }
        //UpdateStatus(button,current,course)
        SetClick(button,course,data);
    }
}    

//publish("setcurrentcourse",courseid)

/*
function UpdateStatus(button,current,course) { // seperate function to remember state
    button.addEventListener("setcurrentcourse",x=> {
        var newcurrent=GlobalCourseList.GetCurrentCourse()
        console.log(`Received setcurrentcourse ${newcurrent} ${current} ${course}`);
        if (newcurrent != current)
            button.dispatchEvent(new CustomEvent("displaydefault"))
        if (newcurrent == course)
            button.dispatchEvent(new CustomEvent("displayactive"))                
     })
}    
*/


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


    
function SetClick(c1,courseid,data) {
     c1.addEventListener('animatedclick',ShowCourseInfo)
        
    function ShowCourseInfo() {
            console.log("animatedclick event in ShowCourseInfo");
           // console.log(e);    
            console.log(courseid);       
            
            var mask=["course","courselevel","level","contributer","level","subtitle","description","goal","start","duration","contributerdescription",["image","courseicon"]]; 
            ForAllElements(data, mask, (id,val) => { setElementVal(id,val,getElement("scr_detail")) }) // find domid object with same name and copy value


            getElement("selectcourse").addEventListener('animatedclick',SelectCourse)     
            getElement("removecourse").addEventListener('animatedclick',RemoveCourse)     
            var tile=this;
            function SelectCourse() {
                console.log("In SelectCourse");
                 getElement("selectcourse").removeEventListener("animatedclick",  SelectCourse);
                getElement("removecourse").removeEventListener("animatedclick",  RemoveCourse);                                 
                
                console.log(courseid);
               // var ev = new CustomEvent("hide");
               // tile.dispatchEvent(ev);  
                GlobalCourseList.SetCurrentCourse(courseid)    
                GlobalCourseList.UpdateMyList(courseid)
            }    
            function RemoveCourse() {
                getElement("selectcourse").removeEventListener("animatedclick",  SelectCourse);
                getElement("removecourse").removeEventListener("animatedclick",  RemoveCourse);                
                
                console.log("In RemoveCourse");
                console.log(courseid);
                var ev = new CustomEvent("hide");
                tile.dispatchEvent(ev);  
                //GlobalCourseList.SetCurrentCourse(courseid)    
                GlobalCourseList.UpdateMyList(courseid,true)
            }   
            
            
            
            
    }         
}


     


window.addEventListener('DOMContentLoaded', asyncloaded);  // load  
 
  
