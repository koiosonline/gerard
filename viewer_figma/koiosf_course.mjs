//console.log(`In ${window.location.href} starting script: ${import.meta.url}`);


import {loadScriptAsync,DomList,LinkToggleButton,subscribe,getElement,MonitorVisible,ForAllElements,setElementVal} from '../lib/koiosf_util.mjs';



class CourseList {    
    constructor (source) {
        this.GlobalCourseListPromise=this.GetJson(source)        
    }
    
  async GetJson(source) {
        var f=await fetch(source)
        console.log(f);
        var Items=await f.json();            
        console.log("GetCourses");
        console.log(Items)
        console.log(JSON.stringify(Items))
        return Items;  
    }
 
    async GetList() {
        return await this.GlobalCourseListPromise;
    }

}    

var GlobalCourseList=new CourseList("https://gpersoon.com/koios/gerard/viewer_figma/courseinfo.json");

export async function GetCourseInfo(key) {
    var cl=localStorage.getItem("CourseLevel"); 
    
    console.log(`GetCourseInfo ${key} ${cl}`)    
    var globallistofcourses=await GlobalCourseList.GetList();
    
    console.log("In GetCourseInfo");
    console.log(globallistofcourses)
    for (var i=0;i<globallistofcourses.length;i++)
        if (globallistofcourses[i].courselevel == cl) {
             var res=globallistofcourses[i][key]
             console.log(res);
             return res;
        }
    return undefined;
     
}

 


async function asyncloaded() {    
    console.log(`In asyncloaded of script: ${import.meta.url}`); 
    //MonitorVisible("scr_detail")
       
   
   var globallistofcourses=await GlobalCourseList.GetList();
   console.log("GlobalCourseList.GetList();")
   console.log(globallistofcourses);
   
   
    console.log(globallistofcourses);
    
    var courselist = new DomList("courselistitem")
    for (var i=0;i<globallistofcourses.length;i++) {
        console.log(globallistofcourses[i]);
        var c1 = courselist.AddListItem() 
        getElement("__label",c1).innerHTML=globallistofcourses[i].courselevel
        SetClick(c1,globallistofcourses[i]);
        
        
        
    }
}    
    
function SetClick(c1,data) {
     c1.addEventListener('animatedclick',SelectCourse)
        
    function SelectCourse() {
            console.log("animatedclick event in SetClick");
           // console.log(e);    
            console.log(data);       
            localStorage.setItem("CourseLevel", data.courselevel);  // this is how the player knows what is selected
            var mask=["course","courselevel","level","contributer","level","subtitle","description","goal","start","duration","contributerdescription"]; //"image"
            ForAllElements(data, mask, (id,val) => { setElementVal(id,val,"scr_detail") }) // find domid object with same name and copy value
            
            //for (x in person) {
      //text += person[x] + " ";
            } 
        
}
     
 


window.addEventListener('DOMContentLoaded', asyncloaded);  // load  
 
 
console.log("json format");
var s={};
s["test"]={}
s["test"].x=1
console.log(s);
console.log(JSON.stringify(s));

