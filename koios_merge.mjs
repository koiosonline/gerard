console.log(`In ${window.location.href} starting script: ${import.meta.url}`);


 
async function MergeLevels() {  
    function FindCourse(course_id) {
        console.log(`Checking course items for ${course_id}`);
        var course_items=document.getElementsByClassName("course-id");     
        for (var i=0; i< course_items.length; i++) {
            console.log(course_items[i].getAttribute("course"));
            console.log(course_id);
            if ( course_items[i].getAttribute("course")  == course_id) {
                console.log("Found");
                console.log(course_items[i]);
                return course_items[i];
            }
        }   
        return undefined;
    }   
    
    function ProcessCourseLevel(course_level_id_domid) {
        console.log(course_level_id_domid);
        var course_id=course_level_id_domid.getAttribute("course");
        console.log(course_id);        
        var course_domid=FindCourse(course_id);
        
        if (course_domid)
            course_domid.parentNode.parentNode.appendChild(course_level_id_domid.parentNode.parentNode);             
        
    }     
    
    var course_level_items=document.getElementsByClassName("course-level-id"); 
    console.log(course_level_items);
    for (var i=0;i<course_level_items.length;i++) {        
        ProcessCourseLevel(course_level_items[i])
    }
}


async function asyncloaded() {    
    console.log(`In asyncloaded of script: ${import.meta.url}`);
    MergeLevels();   
}

window.addEventListener('DOMContentLoaded', asyncloaded);  // load  
 


