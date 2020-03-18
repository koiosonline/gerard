console.log(`In ${window.location.href} starting script: ${import.meta.url}`);


 
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
        
        if (course_domid)
            course_domid.parentNode.parentNode.appendChild(course_level_id_domid.parentNode.parentNode);             
        
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
    for (var i=0;i<course_level_items.length;i++) {        
        ProcessCourseLevel(course_level_items[i])
    }
    
    
    FindAllLinks(fInIframe,parenturl);
    
}


async function asyncloaded() {    
    console.log(`In asyncloaded of script: ${import.meta.url}`);
    var fInIframe =  ( window.location !== window.parent.location );
    
    var url = new URL(window.parent.location);        
    
    MergeLevels(fInIframe,url);   
}

window.addEventListener('DOMContentLoaded', asyncloaded);  // load  
 


