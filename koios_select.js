// <script src="https://gpersoon.com/koios/test/koios_select.js"></script>

//console.log("In koios_select.js");

async function asyncloaded() {  


    function linkclicked(event) {
        event.preventDefault()
        console.log("Clicked");
        console.log(event.target.href);
        window.parent.location.href=event.target.href;
    }
  
    if ( window.location == window.parent.location ) {
        //console.log("Not in an iframe");        
        document.getElementById("select").style.display = "none"; // hide     
    } else {
        //console.log("In iframe, looking for location-bar");
        //console.log(window.location.href);
        //console.log(document.getElementById("location-bar"));
        document.getElementById("location-bar").style.display = "none"; // hide
        document.getElementById("sub-select").style.display = "none"; // hide
        
        
        
        const ttop=window.parent.document.getElementById("top")
        const course=window.parent.document.getElementById("course")
        const course_level=window.parent.document.getElementById("course-level")
        const chapter=window.parent.document.getElementById("chapter")
        const lesson=window.parent.document.getElementById("lesson")
        console.log("parent info");        
        const path=ttop.href +" / "+(course?course.href:"")+" / "+(course_level?course_level.href:"")+" / "+(chapter?chapter.href:"")+" / "+(lesson?lesson.href:"");
        console.log(path);
        
//        var str = "Hello world, welcome to the universe.";
//var n = str.indexOf("welcome");
        
        console.log( path.indexOf("koios"));
        
        const links = document.getElementsByTagName("a");
        for (var i=0;i<links.length;i++) {     
            if ( links[i].id=="children") {
               links[i].addEventListener("click", linkclicked);
               if (path.indexOf(links[i].href) >=0) {// one of the urls in path => highlight
                  links[i].style.color="red";
               }
            }
        }
            //console.log(links[i]);
        //     {
              //  location.href = links[i].href;  // follow the link 
        //        break; // and leave the for loop
        //    }
            
    }
        
        

    // console.log(window.parent); // if ( window.location == window.parent.location ) not in iframe
}




window.addEventListener('load', asyncloaded);  
//console.log("start");