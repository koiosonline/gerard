//console.log(`In ${window.location.href} starting script: ${import.meta.url}`);

//import("https://unpkg.com/itemsjs@latest/dist/itemsjs.min.js")

import {loadScriptAsync,DomList,LinkToggleButton,subscribe,getElement,MonitorVisible,ForAllElements,setElementVal} from '../lib/koiosf_util.mjs';


          
  async function GetCourses(source) {
        var f=await fetch(source)
        console.log(f);
        var Items=await f.json();            
        console.log("GetCourses");
        console.log(Items)
        console.log(JSON.stringify(Items))
        return Items;  
    }


 
async function MergeLevels(fInIframe,parenturl) {  
    function FindCourse(course_id) {
        //console.log(`Checking course items for ${course_id}`);
        var course_items=document.getElementsByClassName("course-id");     
        for (var i=0; i< course_items.length; i++) {
            //console.log(course_items[i].getAttribute("course"));
            //console.log(course_id);
            if ( course_items[i].getAttribute("course")  == course_id) {
                //console.log("Found");
                //console.log(course_items[i]);
                return course_items[i];
            }
        }   
        return undefined;
    }   
    
    function ProcessCourseLevel(course_level_id_domid) {
        //console.log(course_level_id_domid);
        var course_id=course_level_id_domid.getAttribute("course");
        //console.log(course_id);        
        var course_domid=FindCourse(course_id);
        
        if (course_domid) {
      //      console.log(course_domid)
      //      console.log(course_domid.parentNode)
            
            var container=course_domid.parentNode.parentNode.parentNode.getElementsByClassName("course-level-block");
      //      console.log(container);
            container[0].appendChild(course_level_id_domid.parentNode.parentNode);             
        }
        
    }     
    
    
    function FindAllLinks(target,fInIframe,parenturl,courselevel) {
       // console.log(`In FindAllLinks ${courselevel}`);
       // console.log(target);
        var links=target.getElementsByTagName("a");
        for (var i=0;i<links.length;i++) {          
            links[i].target="_top"; // change the "top" page when clicking a link       
            //console.log(`In koios_merge.mjs ${links[i].href} fInIframe=${fInIframe}`);
            if (links[i].href.toLowerCase().includes("koios")) {                     

             
                    var urlhref = new URL(links[i].href)
                    console.log(urlhref);
                    console.log(links[i].href)
                if (fInIframe) 
                        links[i].href = links[i].href.replace("/viewer", parenturl.pathname);
                    links[i].href = links[i].href.replace(urlhref.host, parenturl.host); // also change the prefix
                    console.log(links[i].href)
            
                    
                    
               // console.log(`New url ${links[i].href}`);
               // if (!links[i].href.includes("hash"))
                 //   links[i].href =`${links[i].href}&hash=${hashCode(courselevel)}`
              //  console.log(`New url ${links[i].href}`);
                StoreSelection(links[i])
                 
            }
        }        
        function StoreSelection(target) { // seperate function to store state
           // console.log("Setting listener for");
          //  console.log(target)
            target.addEventListener("click",  SaveToLocalStorage);
             function SaveToLocalStorage() {
                 //console.log(`Saving ${courselevel}`);                 
                 localStorage.setItem("CourseLevel", courselevel);  // this is how the player knows what is selected
             }    
        }
    }   
 
 
     var course_level_items=await GetCourses("https://gpersoon.com/koios/gerard/viewer_figma/courseinfo.json");
console.log("course_level_items")
console.log(course_level_items);
 
   //var course_level_items=document.getElementsByClassName("course-level-id"); 
    //console.log(course_level_items);
    /*   disable merge
    var data=[]
    for (var i=0;i<course_level_items.length;i++) {        
        ProcessCourseLevel(course_level_items[i])
    }
*/    
    


var CatList;
    CatList = new DomList("categories")  
    
    
    var data=[]
    for (var i=0;i<course_level_items.length;i++) {        
        var target=course_level_items[i]
        
        
        
        
        /*var save={}
        save.course=target.course;
        save.courselevel=target.courselevel;
        save.level=target.level;
        save.contributer=target.contributer;
        save.url=target.url;
        save.videoinfo=target.videoinfo;
        save.slides=target.slides;
        */
        data.push(target)
        
        //FindAllLinks(target.parentNode.parentNode,fInIframe,parenturl,save.courselevel);
        
    }
  //  console.log(data);
        

    var configuration= {
      sortings: {
        courselevel: {
          field: 'courselevel',
          order: 'asc'
        }
      },
      aggregations: {
        level: {
          title: 'level',
          size: 10
        },
        courselevel: {
          title: 'courselevel',
          size: 10
        },
        course: {
          title: 'course',
          size: 10
        },
        contributer: {
          title: 'contributer',
          size: 10
        }        
        
      },
      searchableFields: ['courselevel']
    };



    itemsjs = itemsjs(data, configuration);
    itemsjs.search()

        
    var movies = itemsjs.search({
      per_page: 1,
      sort: 'courselevel',
      // full text search
      // query: 'forrest gump',
      filters: {
        level: ['introduction']
      }
    })
    //console.log(JSON.stringify(movies, null, 2));

//console.log("All courses");
//console.log(data);

/*
if (fInIframe) { // only then jump to right course

    var cl=localStorage.getItem("CourseLevel"); 
    console.log(cl);
    var hcl=hashCode(cl)
    
    const queryString = window.parent.parent.location.search;
    const urlParams = new URLSearchParams(queryString);
    let hash = urlParams.get('hash') 
    console.log(`hash ${hash}`);
    
      
    if (hash != hcl) { // find corrent url
        for (var z=0;z<data.length;z++) {
            console.log(`Check ${data[z].courselevel}`)
            if (data[z].courselevel == cl) {
                
                var url =`${data[z].url}&hash=${hcl}`
                
                console.log(`Going to url: ${url}`)    
                console.log(window.parent.parent.location.href)
                url=url.replace("/viewer", parenturl.pathname);
                console.log(parenturl.pathname);
                console.log(url)
                window.parent.parent.location.href = url        
                
                
                
                
            }
        }
    }         
}
*/


MakeSelection(CatList,"course")
MakeSelection(CatList,"level")

//MakeSelection(CatList,"contributer")
        
        
function MakeSelection(domid,catid) {
    var level = domid.AddListItem() 
    level.getElementsByClassName("cat-descript")[0].innerHTML=catid
    var LevelList = new DomList("select-item",level)       
    var top_level = itemsjs.aggregation({
      name: catid,
      per_page: 10
    })
   // console.log(JSON.stringify(top_level, null, 2));
    
            
    for (var i=0;i<top_level.data.buckets.length;i++) {
        var name=top_level.data.buckets[i].key
        
        /*
        if (catid == "course" && !name.toLowerCase().includes("blockchain") ){
            
            SelectItems("course-level-id",catid,name,false)
            continue; // skip all tests
        }
   */
        
        var levelitem = LevelList.AddListItem() 
        
        levelitem.getElementsByClassName("select-txt")[0].innerHTML=name
        
/*        
        var select_btn=levelitem.getElementsByClassName("select-button")[0]
        SetButton("course-level-id",select_btn,catid,i,name,true);    // course-level-id is located in html-embed
        
        var info_btn=levelitem.getElementsByClassName("info-button")[0]
        switch (catid) {
           case "level":      // SetButton("levels",info_btn,catid,i,name,false);    break;
                            info_btn.style.display="none";break;
           case "course":      SetButton("course-id",info_btn,catid,i,name,false);    break;
           case "contributer": SetButton("contributers",info_btn,catid,i,name,false);  break;
        }
*/            
    }

}
    /*

    var top_course = itemsjs.aggregation({
      name: 'course',
      per_page: 10
    })
    console.log(JSON.stringify(top_course, null, 2));


    var course = CatList.AddListItem() 
    course.getElementsByClassName("cat-descript")[0].innerHTML="course"
    var CourseList = new DomList("select-item",course)  

    for (var i=0;i<top_course.data.buckets.length;i++) {
        var courseitem = CourseList.AddListItem() 
        var name=top_course.data.buckets[i].key
        courseitem.getElementsByClassName("select-txt")[0].innerHTML=name
        SetButton(courseitem,"course",i,name);    
    }
*/


    function SetButton(listid,domid,cat,index,name,fInitial) { // to remember state
        var id=`${listid}${cat}item${index}`
        domid.id=id
        LinkToggleButton(id,fInitial);subscribe(`${id}on`,x=>SelectItems(listid,cat,name,true));subscribe(`${id}off`,x=>SelectItems(listid,cat,name,false));
    }    
        
    

    function SelectItems(listid,cat,item,fOn) {
       var list_items=document.getElementsByClassName(listid); 
     
  //    console.log(`In SelectItems ${cat} ${item} ${fOn}`);
      
       for (var i=0;i<list_items.length;i++) {        
           var target=list_items[i]
           if (target.getAttribute(cat)==item) {
           //    console.log(`Found ${cat} ${item}`);
           //    console.log(target.parentNode.parentNode);
               target.parentNode.parentNode.style.display=fOn?"block":"none"
           }
       }  
      
      
    }    
  return data;

}


//scr_detaildisplaynone

var globallistofcoursespromise=LoadCourseInfo();

export async function GetCourseInfo(key) {
    var cl=localStorage.getItem("CourseLevel"); 
    
    console.log(`GetCourseInfo ${key} ${cl}`)
    

    
    if (!globallistofcoursespromise) { 
    console.log(globallistofcoursespromise);        
        console.error("globallistofcoursespromise not present yet")
    }
        
    var globallistofcourses = await globallistofcoursespromise
    
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


async function LoadCourseInfo() {
    console.log("LoadCourseInfo");
    await loadScriptAsync("https://unpkg.com/itemsjs@latest/dist/itemsjs.min.js")
    var fInIframe =  ( window.location !== window.parent.location );    
    var url = new URL(window.parent.parent.location);         // 2x parent in case in double iframe   
    return MergeLevels(fInIframe,url); 
}   




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

async function asyncloaded() {    
    console.log(`In asyncloaded of script: ${import.meta.url}`);
    
    
    MonitorVisible("scr_detail")
    
    

   
   
   //var globallistofcourses = await globallistofcoursespromise
   
   
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
    
    
    

   // if (fInIframe) {
        //var domid=document.getElementById("koiosheader");
        //domid.style.display="none"
    //}
        
    
}

function SetClick(domid,data) { // seperate function to remember state
    console.log("SetClick");
    console.log(domid)
    domid.addEventListener('animatedclick', e=> {
        console.log("animatedclick event in SetClick");
        console.log(e);    
        console.log(data);       
        localStorage.setItem("CourseLevel", data.courselevel);  // this is how the player knows what is selected
        var mask=["course","courselevel","level","contributer","level","subtitle","description","goal","start","duration","contributerdescription"]; //"image"
        ForAllElements(data, mask, (id,val) => { setElementVal(id,val,"scr_detail") }) // find domid object with same name and copy value
        }
     );
}    

 


window.addEventListener('DOMContentLoaded', asyncloaded);  // load  
 


