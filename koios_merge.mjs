//console.log(`In ${window.location.href} starting script: ${import.meta.url}`);

//import("https://unpkg.com/itemsjs@latest/dist/itemsjs.min.js")

import {loadScriptAsync,DomList,LinkToggleButton,subscribe} from './koios_util.mjs';


 
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
    
    
    function FindAllLinks(fInIframe,parenturl) {
        var links=document.getElementsByTagName("a");
        for (var i=0;i<links.length;i++) {          
            links[i].target="_top"; // change the "top" page when clicking a link       
            //console.log(`In koios_merge.mjs ${links[i].href} fInIframe=${fInIframe}`);
            if (fInIframe && links[i].href.includes("playlistId")) {     
                
                links[i].href = links[i].href.replace("/viewer", parenturl.pathname);
                //console.log(`New url ${links[i].href}`);
            }
        }
    }    
    
 
    var course_level_items=document.getElementsByClassName("course-level-id"); 
    //console.log(course_level_items);
    /*   disable merge
    var data=[]
    for (var i=0;i<course_level_items.length;i++) {        
        ProcessCourseLevel(course_level_items[i])
    }
*/    
    FindAllLinks(fInIframe,parenturl);


var CatList;
    CatList = new DomList("categories")  
    
    
    var data=[]
    for (var i=0;i<course_level_items.length;i++) {        
        var target=course_level_items[i]
        var save={}
        save.course=target.getAttribute("course");
        save.courselevel=target.getAttribute("courselevel");
        save.level=target.getAttribute("level");        
        save.contributer=target.getAttribute("contributer");        
        data.push(save)
    }
    console.log(data);
        

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


MakeSelection(CatList,"level")
MakeSelection(CatList,"course")
MakeSelection(CatList,"contributer")
        
        
function MakeSelection(domid,catid) {
    var level = domid.AddListItem() 
    level.getElementsByClassName("cat-descript")[0].innerHTML=catid
    var LevelList = new DomList("select-item",level)       
    var top_level = itemsjs.aggregation({
      name: catid,
      per_page: 10
    })
    console.log(JSON.stringify(top_level, null, 2));

    for (var i=0;i<top_level.data.buckets.length;i++) {
        var levelitem = LevelList.AddListItem() 
        var name=top_level.data.buckets[i].key
        levelitem.getElementsByClassName("select-txt")[0].innerHTML=name
        SetButton(levelitem,catid,i,name);    
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


    function SetButton(domid,cat,index,name) { // to remember state
        var id=`${cat}item${index}`
        domid.id=id
        LinkToggleButton(id,true);subscribe(`${id}on`,x=>SelectItems(cat,name,true));subscribe(`${id}off`,x=>SelectItems(cat,name,false));
    }    

    function SelectItems(cat,item,fOn) {
     
      console.log(`In SelectItems ${cat} ${item} ${fOn}`);
      
       for (var i=0;i<course_level_items.length;i++) {        
           var target=course_level_items[i]
           if (target.getAttribute(cat)==item) {
               console.log(`Found ${cat} ${item}`);
               console.log(target.parentNode.parentNode);
               target.parentNode.parentNode.style.display=fOn?"block":"none"
           }
       }  
      
      
    }    


}


async function asyncloaded() {    
    console.log(`In asyncloaded of script: ${import.meta.url}`);
    await loadScriptAsync("https://unpkg.com/itemsjs@latest/dist/itemsjs.min.js")
    var fInIframe =  ( window.location !== window.parent.location );
    
    var url = new URL(window.parent.parent.location);         // 2x parent in case in double iframe
    
    MergeLevels(fInIframe,url);   
}

window.addEventListener('DOMContentLoaded', asyncloaded);  // load  
 


