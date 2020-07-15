
    console.log("Start script startgen");
    var loadedimages=[]
    
    
    /*
    async function LoadImage(src) {
        console.log("Loading image "+src)
        
        // later convert this to native ipfs
        var data=await fetch(src)
        var text=await data.text()
        //console.log(text);
        
        
        var blob2 = new Blob([text], { type: "image/svg+xml" });
        console.log(blob2);
        var url=URL.createObjectURL(blob2)          
        console.log(url);
        return url;
    } 
*/    



/*
async function SwitchBack(domid,found) {   
    var main=domid.firstChild; 
    main.style.opacity="1";  
    found.style.opacity="0";
    window.getComputedStyle(found).opacity;
    await sleep(200);
    found.style.display="none"; // so the original button is in front again
    main.style.display="block" // enable previous object again
}
*/

async function SwitchTo(domid,divtype) {
     console.log(`SwitchTo ${divtype}`)    
     var previous;
     var found;
    
    var children = domid.childNodes;
    for (var i=0;i<children.length;i++) {
        //children[i].style.display="none"
        children[i].style.transition="all 200 ease-in-out";
        children[i].style.transitionDelay="0s"        
        children[i].style.opacity="0"; // start the transition
        //console.log(children[i].style.display)
        //if (children[i].style.display!="none") {
          //  console.log("found previous")
            
            //previous=children[i];
            //console.log(previous)
            //break; // should just be 1
        //}
    }
    
    var main=domid.firstChild;
    
    
    if (divtype=="") {
        var found=main;
    } else {  
        var btnclass=main.classList[0]
    //    console.log(`SwitchTo ${btnclass}${divtype}`)    
        var foundlist=domid.getElementsByClassName(`${btnclass}${divtype}`)
      //  console.log(foundlist);
        if (foundlist.length==0)
            found=main; // otherwise nothing is visible
         else 
            found=foundlist[0]    
        
    }
 //   console.log("found")
//    console.log(found)
    if (found) { 
    
    //console.log("previous")
    //console.log(previous)
        
        found.style.display="block"
        found.style.width=main.style.width
        found.style.height=main.style.height
        found.style.left=main.style.left
        found.style.top=main.style.top       
        found.style.right=main.style.right       
        found.style.bottom=main.style.bottom      
        found.style.position=main.style.position              
        found.style.transitionDelay="0s"        
        found.style.opacity="0";        
        found.style.transition="all 200 ease-in-out";
        window.getComputedStyle(found).opacity; // delay to prevent the browser optimizing (so you don't see the transition)

        var labelsdest=found.getElementsByClassName("__label")
        var labelssource=main.getElementsByClassName("__label")        
        if (labelssource && labelssource[0] && labelsdest && labelsdest[0])
            labelsdest[0].innerHTML = labelssource[0].innerHTML
        
        
        var labelsdest=found.getElementsByClassName("__icon")
        var labelssource=main.getElementsByClassName("__icon")        
        if (labelssource && labelssource[0] && labelsdest && labelsdest[0])
            labelsdest[0].src = labelssource[0].src
       // console.log(labelssource)
       // console.log(labelsdest)
        
        
        
     
        found.style.opacity="1"; // start the transition
        //await sleep(200);
     //   previous.style.display="none";
       // console.log("found")
       // console.log(found)
      //  console.log("previous")
      //  console.log(previous)
      
        
      
        return found;
    }    
    return undefined;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var globalprevpage;
var currentoverlay

function SwitchPage(newpage) {    
    console.log(`SwitchPage to ${newpage} from ${globalprevpage}`) 	
    if (newpage) {
            if (globalprevpage==newpage) // stays on same page
                return
                
            
            if (currentoverlay) { // usually close the overlay first
                document.getElementsByClassName(currentoverlay)[0].style.display="none" // close the overlay
                currentoverlay=undefined
            }    
            if (newpage=="close") return; // only close the overlay
        
            var destdomid=document.getElementsByClassName(newpage)[0];
            if (!destdomid) { console.error(`Page not found ${newpage}`);return; }
            destdomid.style.display="block"
        //    console.log(destdomid);
            
            if (destdomid.classList.contains("@overlay")) {
         //       console.log("overlay found");
                destdomid.style.zIndex="2"
                
                currentoverlay=newpage
            } else {
                document.getElementsByClassName(globalprevpage)[0].style.display="none"
            //    console.log(document.getElementsByClassName(globalprevpage)[0]);
                globalprevpage=newpage
                currentoverlay=undefined
            }         
            // info.event.preventDefault(); // prevent click on lower laying object // doesn't make a difference            
            
    }
}    


function GetToggleState(domid,key) {
   if (!domid.dataset[key]) return false
   return domid.dataset[key]=="true"
}    

function SetToggleState(domid,key,bool) {
   domid.dataset[key]=bool;
}    

function ToggleState(domid) {
   SetToggleState(domid,!GetToggleState(domid))
}    


async function onclickhandler(event) {
    // preventDefault();
    console.log(`In onclickhandler,  prev=${globalprevpage}  target=${this.dataset?this.dataset.dest:""}` );
     
    var ftoggle=this.className.includes("@toggle") 
    var fclick=this.className.includes("@click")
    if (! (ftoggle || fclick) ) return; // can't find the type of click
    
    if (ftoggle) {
        var ev = new CustomEvent("toggleactive");
        this.dispatchEvent(ev);       
    } else {        
        var ev = new CustomEvent("displayactive");
        this.dispatchEvent(ev); 
        await sleep(200)   
        var ev2 = new CustomEvent("displaydefault");
        this.dispatchEvent(ev2); 
        var ev3 = new CustomEvent('animatedclick');
        console.log("Sending animatedclick to");    
        console.log(ev3)        
        this.dispatchEvent(ev3);              
        if (this.dataset && this.dataset.dest)  // otherwise action is defined elsewhere
        SwitchPage(this.dataset.dest)
    }
}


async function onhidehandler(event) {
    console.log("In onhidehandler");    
    SetToggleState(this,"display",false);    
    this.style.display="none";
}    

async function onshowhandler(event) {
    console.log("In onshowhandler");
    SetToggleState(this,"display",true);
    this.style.display="block"
}    

async function ontoggledisplayhandler(event) {
    console.log("In ontoggledisplayhandler");            
    var ev = new CustomEvent(GetToggleState(this,"display") ?"hide":"show");
    this.dispatchEvent(ev);     
}    



async function ondisplaydefaulthandler(event) {
    console.log("In ondisplaydefaulthandler");
    SetToggleState(this,"displayactive",false);    
    SwitchTo(this,"")
}    

async function ondisplayactivehandler(event) {
    console.log("In ondisplayactivehandler");
    SetToggleState(this,"displayactive",true);    
    SwitchTo(this,"--active")
}  


async function onstarthoverhandler(event) {
    console.log("In onstarthoverhandler");        
    SwitchTo(this,"--hover")
}    

async function onstophoverhandler(event) {
    console.log("In onstophoverhandler");        
    var ev = new CustomEvent(GetToggleState(this,"displayactive")?"displayactive":"displaydefault");
    this.dispatchEvent(ev);      
}    



async function ontoggleactivehandler(event) {
    console.log("In ontoggleactivehandler");
    var ev = new CustomEvent(GetToggleState(this,"displayactive")?"displaydefault":"displayactive");
    this.dispatchEvent(ev);  
    
     await sleep(200)
     var ev2 = new CustomEvent('animatedtoggle');
     console.log("Sending animatedtoggle to");
     console.log(this)
     this.dispatchEvent(ev2);                
    
}    





//setTimeout(main, 3000);


function SetAllEventHandlers(domid) {
    console.log("In SetAllEventHandlers for")
    console.log(domid);
    SetEventHandlers("@toggle",domid)
    SetEventHandlers("@click",domid)
}

function SetEventHandlers(tag,domid) {
    console.log(`SetEventHandlers ${tag}`)
    if (domid)
        SetHandler(domid)
    else { 
        var buttons=document.getElementsByClassName(tag)
        for (var i=0;i<buttons.length;i++) 
           SetHandler(buttons[i]) 
    }
}    

function SetHandler(domid) {
    console.log("Setting handlers for:");
    console.log(domid)
    domid.addEventListener("click",onclickhandler)
    domid.addEventListener("mouseenter",onstarthoverhandler)
    domid.addEventListener("mouseleave",onstophoverhandler)
    domid.addEventListener("hide",onhidehandler)
    domid.addEventListener("show",onshowhandler)
    domid.addEventListener("toggledisplay",ontoggledisplayhandler)
    domid.addEventListener("displaydefault",ondisplaydefaulthandler)
    domid.addEventListener("displayactive",ondisplayactivehandler)
    domid.addEventListener("toggleactive",ontoggleactivehandler)
}        



document.addEventListener("DOMContentLoaded", main)
    
async function main() {
      console.log("DOMContentLoaded");
      var firstpageclass=document.getElementsByClassName ("firstpage")[0].dataset.firstpage
      console.log("Firstpage="+firstpageclass);
      document.getElementsByClassName(firstpageclass)[0].style.display="block"
      globalprevpage=firstpageclass;
      
      SetAllEventHandlers()
      
}


      
      
/*      
      var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

      if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(async function(entries, observer) {
          entries.forEach(async function(entry) {
            if (entry.isIntersecting) {
              let lazyImage = entry.target;
              console.log(JSON.stringify(lazyImage))
              let src=lazyImage.dataset.src;  // get the src element of the dataset (e.g. data-src)
              
              var urlpromise = loadedimages[src]
              if (!urlpromise) {             
                  //loadedimages[src]=true; // make sure it isn't loaded again              
                  loadedimages[src] = urlpromise = LoadImage(src);
              }
              lazyImage.src = await urlpromise;
              console.log(JSON.stringify(lazyImage))
              //lazyImage.srcset = lazyImage.dataset.srcset;
              lazyImage.classList.remove("lazy");
              lazyImageObserver.unobserve(lazyImage);
            }
          });
        });

        lazyImages.forEach(function(lazyImage) {
          lazyImageObserver.observe(lazyImage);
        });
      } else {
        // Possibly fall back to event handlers here
      }
      */
  //  }
  